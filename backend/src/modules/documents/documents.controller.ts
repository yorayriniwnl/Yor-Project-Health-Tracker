import { Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DocumentType, Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DocumentsService } from './documents.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class DocumentsController {
  constructor(private readonly service: DocumentsService) {}
  @Get('projects/:projectId/documents') findByProject(@Param('projectId') projectId: string) { return this.service.findByProject(projectId); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER, Role.CONTRACTOR)
  @Post('projects/:projectId/documents')
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: './uploads', filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`) }), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_req, file, cb) => { const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']; cb(null, allowed.includes(file.mimetype)); } }))
  create(@Param('projectId') projectId: string, @UploadedFile() file: Express.Multer.File, @CurrentUser() user: { id: string }, @Body('documentType') documentType?: DocumentType) { return this.service.create(projectId, file, user.id, documentType); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER)
  @Delete('documents/:id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
