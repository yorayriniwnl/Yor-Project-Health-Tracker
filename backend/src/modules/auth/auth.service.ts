import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new ConflictException('Email is already registered');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email.toLowerCase(),
        passwordHash,
        role: dto.role,
        departmentId: dto.departmentId
      },
      select: { id: true, fullName: true, email: true, role: true, departmentId: true, status: true }
    });
    return { user, ...this.tokens(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user) throw new UnauthorizedException('Invalid email or password');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid email or password');
    const safeUser = { id: user.id, fullName: user.fullName, email: user.email, role: user.role, departmentId: user.departmentId, status: user.status };
    return { user: safeUser, ...this.tokens(safeUser) };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, role: true, departmentId: true, status: true }
    });
  }

  private tokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessExpiresIn = this.config.get<JwtSignOptions['expiresIn']>('JWT_EXPIRES_IN') ?? '15m';
    const refreshExpiresIn = this.config.get<JwtSignOptions['expiresIn']>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    return {
      accessToken: this.jwt.sign(payload, { expiresIn: accessExpiresIn }),
      refreshToken: this.jwt.sign(payload, { secret: this.config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret', expiresIn: refreshExpiresIn })
    };
  }
}
