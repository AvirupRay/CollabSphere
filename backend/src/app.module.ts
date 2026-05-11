import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { DocumentsModule } from './documents/documents.module';
import { CollaborationModule } from './collaboration/collaboration.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [AuthModule, PrismaModule, DocumentsModule, CollaborationModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
