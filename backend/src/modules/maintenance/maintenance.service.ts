import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}
  findByProject(projectId: string) { return this.prisma.maintenanceRecord.findMany({ where: { projectId }, orderBy: { maintenanceDate: 'desc' } }); }
  create(projectId: string, dto: CreateMaintenanceDto) { return this.prisma.maintenanceRecord.create({ data: { ...dto, projectId, maintenanceDate: dto.maintenanceDate ? new Date(dto.maintenanceDate) : undefined, nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined } as any }); }
  update(id: string, dto: UpdateMaintenanceDto) { return this.prisma.maintenanceRecord.update({ where: { id }, data: { ...dto, maintenanceDate: dto.maintenanceDate ? new Date(dto.maintenanceDate) : undefined, nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined } as any }); }
  remove(id: string) { return this.prisma.maintenanceRecord.delete({ where: { id } }); }
}
