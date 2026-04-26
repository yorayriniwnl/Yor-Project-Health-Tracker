import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProjectStatus, RiskLevel, Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  @Get('public')
  publicList(@Query() query: Record<string, unknown>) { return this.service.publicList(query); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(@Query() query: Record<string, unknown>) { return this.service.findAll(query); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN)
  @Post()
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: { id: string }) { return this.service.create(dto, user.id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto, @CurrentUser() user: { id: string }) { return this.service.update(id, dto, user.id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: ProjectStatus, @CurrentUser() user: { id: string }) { return this.service.updateStatus(id, status, user.id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER, Role.CONTRACTOR)
  @Patch(':id/progress')
  updateProgress(@Param('id') id: string, @Body('progressPercentage') progressPercentage: number, @CurrentUser() user: { id: string }) { return this.service.updateProgress(id, Number(progressPercentage), user.id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/health')
  health(@Param('id') id: string) { return this.service.health(id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER, Role.AUDITOR)
  @Post(':id/recalculate-health')
  recalculateHealth(@Param('id') id: string, @CurrentUser() user: { id: string }) { return this.service.recalculateHealth(id, user.id); }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.PROJECT_MANAGER, Role.AUDITOR)
  @Post(':id/risks')
  addRisk(
    @Param('id') id: string,
    @Body() body: { riskTitle: string; riskDescription?: string; riskLevel?: RiskLevel; status?: string; resolutionNotes?: string },
    @CurrentUser() user: { id: string }
  ) { return this.service.addRisk(id, body, user.id); }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) { return this.service.remove(id, user.id); }
}
