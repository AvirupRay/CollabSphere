import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { DocumentRepository } from '../../documents/repositories/documents.repository';

interface DocumentChangeData {
  documentId: string;
  delta: string;
}


interface JoinDocumentData {
  documentId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CollaborationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // In-memory cache
  private saveTimers = new Map<string, NodeJS.Timeout>();
  
  private readonly jwtSecret = process.env.JWT_SECRET || 'SUPER_SECRET_KEY';

  private presence = new Map<string, Set<string>>();

  constructor(
    private readonly documentsRepository: DocumentRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService
  ) {}

  // 🔐 Authenticate socket connection
  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;

      if (!token) {
        throw new Error('No token');
      }

      const payload = this.jwtService.verify(token, {
        secret: this.jwtSecret,
      });

      // attach user to socket
      client.data.user = payload;

      console.log(
        `Client ${client.id} connected as ${payload.email}`,
      );
    } catch (error) {
      console.log(`Auth failed for client ${client.id}`);
      client.disconnect();
    }
  }

  // ❌ Disconnect
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const user = client.data.user;
    if(!user) return;

    for(const [documentId,users] of this.presence.entries()){
      if(user.has(user.sub)){
        user.delete(user.sub);

        //brodcast the update
        this.server.to(documentId).emit('presence-update',{
          user: Array.from(users),
        })
      }
    }
  }

  // 📄 JOIN DOCUMENT
  @SubscribeMessage('join-document')
  async handleJoinDocument(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinDocumentData,
  ) {
    const { documentId } = data;
    const user = client.data.user;
    const redis = this.redisService.getClient();

    // 1️⃣ Join room
    client.join(documentId);

    const userId = user.sub;

    if (!this.presence.has(documentId)) {
      this.presence.set(documentId, new Set());
    }
    const users = this.presence.get(documentId) ?? new Set<string>();

    users.add(userId);
    this.presence.set(documentId, users);

    this.server.to(documentId).emit('presence-update', {
      users: Array.from(users),
    });

    console.log(
      `User ${user.email} joined document ${documentId}`,
    );

    try {
      // 2️⃣ Fetch document from DB
      const document =
        await this.documentsRepository.getDocumentById(documentId);

      if (!document) {
        client.emit('error', { message: 'Document not found' });
        return;
      }

      // 🔐 Authorization check
      const collaborator =
        await this.documentsRepository.getCollaborator(
          documentId,
          user.sub,
        );

      if (
        document.ownerID !== user.sub &&
        !collaborator
      ) {
        client.emit('error', { message: 'Unauthorized' });
        return;
      }

      // check redis First
      let content = await redis.get(`doc:${documentId}`)

      if(!content){
        content = document.content;
        await redis.set(`doc:${documentId}`, JSON.stringify(content));
      }
      else{
        content = JSON.parse(content);
      }

      // 3️⃣ Send document ONLY to this user
      client.emit('document-load', {
        content: content,
        version: document.version,
      });

      console.log(`User ${user.email} joined the doc ${documentId}`);

    } catch (error) {
      console.error('Error joining document:', error);
      client.emit('error', { message: 'Failed to load document' });
    }
  }

  // ✏️ DOCUMENT CHANGE
  @SubscribeMessage('document-change')
  async handleDocumentChange(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      documentId: string;
      delta: any;
    },
  ) {
    const { documentId, delta } = data;
    const redis = this.redisService.getClient();

    const user = client.data.user;

    // fetch document
    const document = await this.documentsRepository.getDocumentById(documentId);
    
    if(!document){
      client.emit('error',{message: 'Document not found'})
      return;
    }

    //check collaborator
    const collaborator = await this.documentsRepository.getCollaborator(
      documentId,
      user.sub,
    )

    //Role check
    if(document.ownerID !== user.sub){
      if(!collaborator){
        client.emit('error',{message:'unauthorized'});
        return;
      }
      
      if(collaborator.role !=='editor'){
        client.emit('error',{message: 'Read-Only Access'});
        return;
      }
    }

    // 1️⃣ Broadcast to others
    client.to(documentId).emit('document-update', { delta });

    // 2️⃣ Store in Redis
    await redis.set(`doc:${documentId}`, JSON.stringify(delta));

    // 3️⃣ Debounce DB save
    if (this.saveTimers.has(documentId)) {
      clearTimeout(this.saveTimers.get(documentId));
    }

    const timer = setTimeout(async () => {
      const data = await redis.get(`doc:${documentId}`);
      if (!data) return;

      const content = JSON.parse(data);

      await this.documentsRepository.updateDoc(documentId, {
        content,
        title: ''
      });

      console.log(`💾 Saved document ${documentId}`);
    }, 2000);

    this.saveTimers.set(documentId, timer);
  }

  @SubscribeMessage('cursor-move')
  handleCursorMove(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      documentId: string;
      position: number;
    },
  ){
    const user = client.data.user;
    const {documentId,position} = data;

    // Brodcast to others
    client.to(documentId).emit('cursor-update',{
      userId: user.sub,
      position,
    })
  }
  
}