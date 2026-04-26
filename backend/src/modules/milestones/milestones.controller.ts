import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { MilestonesService } from './milestones.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class MilestonesController {
  constructor(private readonly service: MilestonesService) {}
  @Get('projects/:projectId/milestones') findByProject(@Param('projectId') projectId: string) { return this.service.findByProject(projectId); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER)
  @Post('projects/:projectId/milestones') create(@Param('projectId') projectId: string, @Body() dto: CreateMilestoneDto) { return this.service.create(projectId, dto); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER, Role.CONTRACTOR)
  @Put('milestones/:id') update(@Param('id') id: string, @Body() dto: UpdateMilestoneDto) { return this.service.update(id, dto); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN)
  @Delete('milestones/:id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
