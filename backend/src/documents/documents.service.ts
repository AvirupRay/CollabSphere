import { Injectable } from '@nestjs/common';
import { CreateDocument, UpdateDocument } from './dto/document.dto';
import { DocumentRepository } from './repositories/documents.repository';

@Injectable()
export class DocumentsService {

    constructor(private repo:DocumentRepository){}

    async createDocument(userId:string,dto:CreateDocument){
        return this.repo.createDoc(userId,dto)
    }

    async updateDocument(documentId:string, dto:UpdateDocument){
        return this.repo.updateDoc(documentId,dto)
    }

    async findAllDocuments(userId:string){
        return this.repo.findDocs(userId)
    }
}
