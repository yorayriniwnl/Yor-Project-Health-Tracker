import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { pagination } from '../../common/utils/query';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}
  async findAll(query: Record<string, unknown>) {
    const { page, limit, skip } = pagination(query);
    const where: any = {};
    if (query.userId) where.userId = String(query.userId);
    if (query.entityType) where.entityType = String(query.entityType);
    if (query.entityId) where.entityId = String(query.entityId);
    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, fullName: true, email: true, role: true } } } }),
      this.prisma.auditLog.count({ where })
    ]);
    return { items, meta: { total, page, limit } };
  }
  findByEntity(entityType: string, entityId: string) { return this.prisma.auditLog.findMany({ where: { entityType, entityId }, orderBy: { createdAt: 'desc' }, include: { user: { select: { id: true, fullName: true, email: true, role: true } } } }); }
}
