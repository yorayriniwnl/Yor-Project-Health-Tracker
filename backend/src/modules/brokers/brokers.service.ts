import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { pagination, sort } from '../../common/utils/query';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';

@Injectable()
export class BrokersService {
  constructor(private prisma: PrismaService) {}
  async findAll(query: Record<string, unknown>) {
    const { page, limit, skip } = pagination(query);
    const where: any = {};
    const searchTerm = query.search ?? query.q;
    if (query.riskLevel) where.riskLevel = String(query.riskLevel);
    if (query.complianceStatus) where.complianceStatus = String(query.complianceStatus);
    if (searchTerm) where.OR = [{ brokerName: { contains: String(searchTerm), mode: 'insensitive' } }, { organization: { contains: String(searchTerm), mode: 'insensitive' } }];
    const [items, total] = await this.prisma.$transaction([this.prisma.broker.findMany({ where, skip, take: limit, orderBy: sort(query, 'createdAt'), include: { _count: { select: { projects: true } } } }), this.prisma.broker.count({ where })]);
    return { items, meta: { total, page, limit } };
  }
  async findOne(id: string) { const item = await this.prisma.broker.findUnique({ where: { id }, include: { projects: true } }); if (!item) throw new NotFoundException('Broker not found'); return item; }
  create(dto: CreateBrokerDto) { return this.prisma.broker.create({ data: dto as any }); }
  update(id: string, dto: UpdateBrokerDto) { return this.prisma.broker.update({ where: { id }, data: dto as any }); }
  remove(id: string) { return this.prisma.broker.delete({ where: { id } }); }
  projects(id: string) { return this.prisma.project.findMany({ where: { brokerId: id }, include: { department: true, contractor: true } }); }
  async risk(id: string) { const broker = await this.findOne(id); return { brokerId: id, riskLevel: broker.riskLevel, complianceStatus: broker.complianceStatus, conflictOfInterest: broker.conflictOfInterest, linkedProjects: broker.projects.length, remarks: broker.remarks }; }
}
