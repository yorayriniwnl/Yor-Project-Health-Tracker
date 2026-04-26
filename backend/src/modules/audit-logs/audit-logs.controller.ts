import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuditLogsService } from './audit-logs.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.AUDITOR)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly service: AuditLogsService) {}
  @Get() findAll(@Query() query: Record<string, unknown>) { return this.service.findAll(query); }
  @Get(':entityType/:entityId') findByEntity(@Param('entityType') entityType: string, @Param('entityId') entityId: string) { return this.service.findByEntity(entityType, entityId); }
}
