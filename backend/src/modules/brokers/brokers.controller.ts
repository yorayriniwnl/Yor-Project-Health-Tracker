import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BrokersService } from './brokers.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('brokers')
export class BrokersController {
  constructor(private readonly service: BrokersService) {}
  @Get() findAll(@Query() query: Record<string, unknown>) { return this.service.findAll(query); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN)
  @Post() create(@Body() dto: CreateBrokerDto) { return this.service.create(dto); }
  @Roles(Role.SUPER_ADMIN, Role.GOVERNMENT_ADMIN, Role.AUDITOR)
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateBrokerDto) { return this.service.update(id, dto); }
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
  @Get(':id/projects') projects(@Param('id') id: string) { return this.service.projects(id); }
  @Get(':id/risk') risk(@Param('id') id: string) { return this.service.risk(id); }
}
