import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { pagination, sort } from '../../common/utils/query';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}

  private normalize(dto: Partial<CreateContractorDto>) {
    if (dto.totalProjectsDelivered !== undefined && dto.pastProjectsHandled !== undefined && dto.totalProjectsDelivered > dto.pastProjectsHandled) throw new BadRequestException('Total delivered cannot exceed past projects handled');
    const delivered = Number(dto.totalProjectsDelivered ?? 0);
    const handled = Number(dto.pastProjectsHandled ?? 0);
    const successRate = dto.successRate ?? (handled > 0 ? (delivered / handled) * 100 : 0);
    return { ...dto, successRate };
  }

  async findAll(query: Record<string, unknown>) {
    const { page, limit, skip } = pagination(query);
    const where: any = {};
    const searchTerm = query.search ?? query.q;
    if (query.blacklisted !== undefined) where.blacklisted = String(query.blacklisted) === 'true';
    if (searchTerm) where.OR = [{ contractorName: { contains: String(searchTerm), mode: 'insensitive' } }, { companyName: { contains: String(searchTerm), mode: 'insensitive' } }, { registrationNumber: { contains: String(searchTerm), mode: 'insensitive' } }];
    const [items, total] = await this.prisma.$transaction([this.prisma.contractor.findMany({ where, skip, take: limit, orderBy: sort(query, 'successRate'), include: { _count: { select: { projects: true } } } }), this.prisma.contractor.count({ where })]);
    return { items, meta: { total, page, limit } };
  }
  async findOne(id: string) { const item = await this.prisma.contractor.findUnique({ where: { id }, include: { projects: true } }); if (!item) throw new NotFoundException('Contractor not found'); return item; }
  create(dto: CreateContractorDto) { return this.prisma.contractor.create({ data: this.normalize(dto) as any }); }
  update(id: string, dto: UpdateContractorDto) { return this.prisma.contractor.update({ where: { id }, data: this.normalize(dto) as any }); }
  remove(id: string) { return this.prisma.contractor.delete({ where: { id } }); }
  projects(id: string) { return this.prisma.project.findMany({ where: { contractorId: id }, include: { department: true, broker: true } }); }
  async performance(id: string) {
    const contractor = await this.findOne(id);
    const delivered = Math.max(contractor.totalProjectsDelivered, 1);
    return { contractorId: id, successRate: contractor.successRate, onTimeRate: (contractor.completedOnTime / delivered) * 100, withinBudgetRate: (contractor.completedWithinBudget / delivered) * 100, qualityRating: contractor.qualityRating, blacklisted: contractor.blacklisted, activeProjects: contractor.projects.length };
  }
}
