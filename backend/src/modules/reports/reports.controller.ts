import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}
  @Get('healthy-projects') healthyProjects(@Query() query: Record<string, unknown>) { return this.service.healthyProjects(query); }
  @Get('critical-projects') criticalProjects(@Query() query: Record<string, unknown>) { return this.service.criticalProjects(query); }
  @Get('delayed-projects') delayedProjects(@Query() query: Record<string, unknown>) { return this.service.delayedProjects(query); }
  @Get('over-budget-projects') overBudgetProjects(@Query() query: Record<string, unknown>) { return this.service.overBudgetProjects(query); }
  @Get('completed-projects') completedProjects(@Query() query: Record<string, unknown>) { return this.service.completedProjects(query); }
  @Get('budget-utilization') budgetUtilization(@Query() query: Record<string, unknown>) { return this.service.budgetUtilization(query); }
  @Get('public-transparency') publicTransparency(@Query() query: Record<string, unknown>) { return this.service.publicTransparency(query); }
  @Get('contractor-performance') contractorPerformance() { return this.service.contractorPerformance(); }
  @Get('broker-risk') brokerRisk() { return this.service.brokerRisk(); }
  @Get('maintenance-heavy-projects') maintenanceHeavyProjects(@Query() query: Record<string, unknown>) { return this.service.maintenanceHeavyProjects(query); }
  @Get('department-performance') departmentPerformance() { return this.service.departmentPerformance(); }
  @Get('export') async export(@Query('type') type = 'project-health', @Query('format') format = 'csv', @Query() query: Record<string, unknown>, @Res() res: Response) {
    const buffer = await this.service.export(type, format, query);
    const contentType = format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : format === 'pdf' ? 'application/pdf' : 'text/csv';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${type}.${format === 'xlsx' ? 'xlsx' : format}"`);
    res.send(buffer);
  }
}
