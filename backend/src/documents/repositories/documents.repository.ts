import { Injectable } from "@nestjs/common";
import { CreateDocument, UpdateDocument } from "../dto/document.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { title } from "process";

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
}