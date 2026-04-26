import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}
  @Roles(Role.SUPER_ADMIN)
  @Get()
  findAll(@Query() query: Record<string, unknown>) { return this.service.findAll(query); }
  @Roles(Role.SUPER_ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Roles(Role.SUPER_ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) { return this.service.create(dto); }
  @Roles(Role.SUPER_ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) { return this.service.update(id, dto); }
  @Roles(Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
