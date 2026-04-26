import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsService } from './departments.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}
  @Get() findAll(@Query() query: Record<string, unknown>) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Roles(Role.SUPER_ADMIN)
  @Post() create(@Body() dto: CreateDepartmentDto) { return this.service.create(dto); }
  @Roles(Role.SUPER_ADMIN)
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) { return this.service.update(id, dto); }
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}
