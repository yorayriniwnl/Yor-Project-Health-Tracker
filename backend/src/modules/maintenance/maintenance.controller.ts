import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenanceService } from './maintenance.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}
  @Get('projects/:projectId/maintenance') findByProject(@Param('projectId') projectId: string) { return this.service.findByProject(projectId); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER)
  @Post('projects/:projectId/maintenance') create(@Param('projectId') projectId: string, @Body() dto: CreateMaintenanceDto) { return this.service.create(projectId, dto); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER)
  @Put('maintenance/:id') update(@Param('id') id: string, @Body() dto: UpdateMaintenanceDto) { return this.service.update(id, dto); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN)
  @Delete('maintenance/:id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
