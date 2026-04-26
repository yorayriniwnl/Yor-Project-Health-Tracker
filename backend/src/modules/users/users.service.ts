import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { pagination, sort } from '../../common/utils/query';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, unknown>) {
    const { page, limit, skip } = pagination(query);
    const where: any = {};
    if (query.role) where.role = String(query.role);
    if (query.departmentId) where.departmentId = String(query.departmentId);
    if (query.search) where.OR = [{ fullName: { contains: String(query.search), mode: 'insensitive' } }, { email: { contains: String(query.search), mode: 'insensitive' } }];
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({ where, skip, take: limit, orderBy: sort(query, 'createdAt'), select: { id: true, fullName: true, email: true, role: true, departmentId: true, status: true, createdAt: true, updatedAt: true } }),
      this.prisma.user.count({ where })
    ]);
    return { items, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true, fullName: true, email: true, role: true, departmentId: true, status: true, createdAt: true, updatedAt: true } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({ data: { fullName: dto.fullName, email: dto.email.toLowerCase(), passwordHash, role: dto.role, departmentId: dto.departmentId, status: dto.status }, select: { id: true, fullName: true, email: true, role: true, departmentId: true, status: true } });
  }

  async update(id: string, dto: UpdateUserDto) {
    const { password, ...rest } = dto;
    const data: any = { ...rest };
    if (password) data.passwordHash = await bcrypt.hash(password, 12);
    return this.prisma.user.update({ where: { id }, data, select: { id: true, fullName: true, email: true, role: true, departmentId: true, status: true } });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
