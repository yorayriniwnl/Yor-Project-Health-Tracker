import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}
  @Get('summary') summary() { return this.service.summary(); }
  @Get('project-health') projectHealth() { return this.service.projectHealth(); }
  @Get('budget-summary') budgetSummary() { return this.service.budgetSummary(); }
  @Get('department-performance') departmentPerformance() { return this.service.departmentPerformance(); }
  @Get('contractor-performance') contractorPerformance() { return this.service.contractorPerformance(); }
  @Get('location-performance') locationPerformance() { return this.service.locationPerformance(); }
  @Get('delayed-projects') delayedProjects() { return this.service.delayedProjects(); }
  @Get('critical-projects') criticalProjects() { return this.service.criticalProjects(); }
}
