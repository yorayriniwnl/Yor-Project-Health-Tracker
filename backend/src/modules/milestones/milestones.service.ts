import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(private prisma: PrismaService) {}
  findByProject(projectId: string) { return this.prisma.milestone.findMany({ where: { projectId }, orderBy: { plannedEndDate: 'asc' } }); }
  create(projectId: string, dto: CreateMilestoneDto) { return this.prisma.milestone.create({ data: { ...dto, projectId, plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : undefined, plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : undefined, actualStartDate: dto.actualStartDate ? new Date(dto.actualStartDate) : undefined, actualEndDate: dto.actualEndDate ? new Date(dto.actualEndDate) : undefined } as any }); }
  update(id: string, dto: UpdateMilestoneDto) { return this.prisma.milestone.update({ where: { id }, data: { ...dto, plannedStartDate: dto.plannedStartDate ? new Date(dto.plannedStartDate) : undefined, plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : undefined, actualStartDate: dto.actualStartDate ? new Date(dto.actualStartDate) : undefined, actualEndDate: dto.actualEndDate ? new Date(dto.actualEndDate) : undefined } as any }); }
  remove(id: string) { return this.prisma.milestone.delete({ where: { id } }); }
}
