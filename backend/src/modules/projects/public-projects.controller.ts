import { Controller, Get, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('public')
export class PublicProjectsController {
  constructor(private readonly service: ProjectsService) {}
  @Get('projects')
  projects(@Query() query: Record<string, unknown>) { return this.service.publicList(query); }
  @Get('completed-projects')
  completedProjects(@Query() query: Record<string, unknown>) { return this.service.publicList({ ...query, status: 'COMPLETED' }); }
}
