import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { PublicProjectsController } from './public-projects.controller';
import { ProjectsService } from './projects.service';
@Module({ controllers: [ProjectsController, PublicProjectsController], providers: [ProjectsService], exports: [ProjectsService] })
export class ProjectsModule {}
