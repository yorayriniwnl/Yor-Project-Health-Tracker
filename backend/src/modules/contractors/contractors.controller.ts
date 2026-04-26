import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contractors')
export class ContractorsController {
  constructor(private readonly service: ContractorsService) {}
  @Get() findAll(@Query() query: Record<string, unknown>) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN)
  @Post() create(@Body() dto: CreateContractorDto) { return this.service.create(dto); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN)
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateContractorDto) { return this.service.update(id, dto); }
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
  @Get(':id/projects') projects(@Param('id') id: string) { return this.service.projects(id); }
  @Get(':id/performance') performance(@Param('id') id: string) { return this.service.performance(id); }
}
