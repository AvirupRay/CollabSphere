import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateDocument, UpdateDocument } from './dto/document.dto';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {

    constructor(private docService: DocumentsService){}

    @UseGuards(JwtAuthGuard)
    @Post()
    createDocument(@Req() req, @Body() dto: CreateDocument ){
        return this.docService.createDocument(req.user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    updateDocument(@Param('id') docId:string,@Req() req, @Body() dto: UpdateDocument){
        return this.docService.updateDocument(docId, req.user.userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getAllDocuments(@Param('id') userId:string){
        return this.docService.findAllDocuments(userId);
    }

    @Post(':id/share')
        @UseGuards(JwtAuthGuard)
        shareDocument(
        @Param('id') documentId: string,
        @Req() req,
        @Body() body: { email: string; role: string },
        ) {
        return this.docService.shareDocument(
            documentId,
            req.user.userId,
            body.email,
            body.role,
        );
    }
}
