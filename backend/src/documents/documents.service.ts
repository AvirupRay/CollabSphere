import { Injectable } from '@nestjs/common';
import { CreateDocument, UpdateDocument } from './dto/document.dto';
import { DocumentRepository } from './repositories/documents.repository';

@Injectable()
export class DocumentsService {

    constructor(private repo:DocumentRepository){}

    async createDocument(userId:string,dto:CreateDocument){
        return this.repo.createDoc(userId,dto)
    }

    async updateDocument(documentId:string, userId:string, dto:UpdateDocument){
        
        const document= this.repo.getDocumentById(documentId);
        
        if(!document){
            throw new Error('Document not found')
        }

        const collaborator=await this.repo.getCollaborator(documentId,userId);

        if(document.ownerID !== userId){
            if(!collaborator){
                throw new Error('Unauthorized')
            }

            if(collaborator.role !== 'editor'){
                throw new Error('Read-Only access');
            }
        }
        
        return this.repo.updateDoc(documentId,dto)
    }

    async findAllDocuments(userId:string){
        return this.repo.findDocs(userId)
    }

    async shareDocument(
        documentId: string,
        ownerId: string,
        email: string,
        role: string,
        ) {
        // 1️⃣ get document
        const document = await this.repo.getDocumentById(documentId);

        if (!document) {
            throw new Error('Document not found');
        }

        // 2️⃣ check owner
        if (document.ownerID !== ownerId) {
            throw new Error('Only owner can share');
        }

        // 3️⃣ find user
        const user = await this.repo.findUserByEmail(email);

        if (!user) {
            throw new Error('User not found');
        }

        // 4️⃣ prevent duplicate
        const existing = await this.repo.getCollaborator(
            documentId,
            user.id,
        );

        if (existing) {
            throw new Error('Already collaborator');
        }

        // 5️⃣ add collaborator
        return this.repo.addCollaborator(
            documentId,
            user.id,
            role,
        );
    }
}
