import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentRepository } from './repositories/documents.repository';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService,DocumentRepository]
})
export class DocumentsModule {}
