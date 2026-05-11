import { Injectable } from "@nestjs/common";
import { CreateDocument, UpdateDocument } from "../dto/document.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class DocumentRepository{
    constructor(private prisma:PrismaService){}

    createDoc(userId:string, dto:CreateDocument){
        return this.prisma.document.create({
            data:{
                title: dto.title,
                content: dto.content,
                ownerID: userId,
            }
        })
    }

    updateDoc(documentId:string, dto:UpdateDocument){
        return this.prisma.document.update({
            where:{
                id: documentId,
            },
            data:{ 
                ...dto,
                version:{
                    increment:1,
                }
            },
        })
    }

    findDocs(userId:string){
        return this.prisma.document.findMany({
            where:{
                ownerID: userId
            }
        })
    }

    async getDocumentById(documentId: string) {
        return this.prisma.document.findUnique({
            where: { id: documentId },
        });
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async addCollaborator(
        documentId: string,
        userId: string,
        role: string,
        ) {
        return this.prisma.documentCollaborator.create({
            data: {
            documentId,
            userId,
            role,
            },
        });
    }

    async getCollaborator(documentId: string, userId: string) {
        return this.prisma.documentCollaborator.findFirst({
            where: {
            documentId,
            userId,
            },
        });
    }
}