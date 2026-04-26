import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { pagination, sort } from '../../common/utils/query';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}
  async findAll(query: Record<string, unknown>) {
    const { page, limit, skip } = pagination(query);
    const where: any = query.search ? { OR: [{ name: { contains: String(query.search), mode: 'insensitive' } }, { ministryName: { contains: String(query.search), mode: 'insensitive' } }, { region: { contains: String(query.search), mode: 'insensitive' } }] } : {};
    const [items, total] = await this.prisma.$transaction([this.prisma.department.findMany({ where, skip, take: limit, orderBy: sort(query, 'createdAt'), include: { _count: { select: { projects: true, users: true } } } }), this.prisma.department.count({ where })]);
    return { items, meta: { total, page, limit } };
  }
  async findOne(id: string) {
    const item = await this.prisma.department.findUnique({ where: { id }, include: { projects: true, users: true } });
    if (!item) throw new NotFoundException('Department not found');
    return item;
  }
  create(dto: CreateDepartmentDto) { return this.prisma.department.create({ data: dto }); }
  update(id: string, dto: UpdateDepartmentDto) { return this.prisma.department.update({ where: { id }, data: dto }); }
  remove(id: string) { return this.prisma.department.delete({ where: { id } }); }
}
