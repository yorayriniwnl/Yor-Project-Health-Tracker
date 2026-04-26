import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}
  findByProject(projectId: string) { return this.prisma.projectDocument.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } }); }
  create(projectId: string, file: Express.Multer.File, uploadedById: string, documentType: DocumentType = DocumentType.OTHER) {
    if (!file) throw new BadRequestException('A valid PDF, image, Excel, or CSV file is required');
    return this.prisma.projectDocument.create({ data: { projectId, uploadedById, documentName: file.originalname, documentType, fileUrl: `/uploads/${file.filename}` } });
  }
  remove(id: string) { return this.prisma.projectDocument.delete({ where: { id } }); }
}
