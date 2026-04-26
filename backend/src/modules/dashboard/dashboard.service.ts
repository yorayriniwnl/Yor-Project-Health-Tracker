import { Injectable } from '@nestjs/common';
import { HealthStatus, ProjectStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const [totalProjects, completedProjects, inProgressProjects, delayedProjects, criticalProjects, healthyProjects, budgets, contractors] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({ where: { status: ProjectStatus.COMPLETED } }),
      this.prisma.project.count({ where: { status: ProjectStatus.IN_PROGRESS } }),
      this.prisma.project.count({ where: { OR: [{ status: ProjectStatus.DELAYED }, { expectedCompletionDate: { lt: new Date() }, status: { not: ProjectStatus.COMPLETED } }] } }),
      this.prisma.project.count({ where: { healthStatus: HealthStatus.CRITICAL } }),
      this.prisma.project.count({ where: { healthStatus: HealthStatus.HEALTHY } }),
      this.prisma.project.aggregate({ _sum: { budgetAllocated: true, budgetSpent: true, actualMaintenanceCost: true, annualMaintenanceCost: true } }),
      this.prisma.contractor.aggregate({ _avg: { successRate: true } })
    ]);
    const budgetRows = await this.prisma.project.findMany({ select: { budgetAllocated: true, budgetSpent: true } });
    const overBudgetProjects = budgetRows.filter((project) => Number(project.budgetSpent) > Number(project.budgetAllocated)).length;
    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      delayedProjects,
      overBudgetProjects,
      criticalProjects,
      totalHealthyProjects: healthyProjects,
      totalBudgetAllocated: budgets._sum.budgetAllocated ?? 0,
      totalBudgetSpent: budgets._sum.budgetSpent ?? 0,
      totalMaintenanceCost: budgets._sum.annualMaintenanceCost ?? budgets._sum.actualMaintenanceCost ?? 0,
      averageContractorSuccessRate: contractors._avg.successRate ?? 0
    };
  }

  async projectHealth() {
    const rows = await this.prisma.project.groupBy({ by: ['healthStatus'], _count: { healthStatus: true } });
    return rows.map((row) => ({ healthStatus: row.healthStatus, count: row._count.healthStatus }));
  }
  async budgetSummary() {
    const projects = await this.prisma.project.findMany({
      orderBy: { budgetAllocated: 'desc' },
      take: 10,
      select: { projectName: true, budgetAllocated: true, budgetSpent: true }
    });
    return projects.map((project) => ({ projectName: project.projectName, allocated: Number(project.budgetAllocated), spent: Number(project.budgetSpent) }));
  }
  async departmentPerformance() {
    const departments = await this.prisma.department.findMany({ include: { projects: true } });
    return departments.map((department) => ({ departmentId: department.id, department: department.name, projects: department.projects.length, averageHealthScore: department.projects.reduce((sum, project) => sum + project.healthScore, 0) / Math.max(department.projects.length, 1), delayedProjects: department.projects.filter((project) => project.status === ProjectStatus.DELAYED).length }));
  }
  contractorPerformance() { return this.prisma.contractor.findMany({ orderBy: { successRate: 'desc' }, take: 20, include: { _count: { select: { projects: true } } } }); }
  locationPerformance() { return this.prisma.project.groupBy({ by: ['location'], _count: { location: true }, _avg: { healthScore: true } }); }
  delayedProjects() { return this.prisma.project.findMany({ where: { OR: [{ status: ProjectStatus.DELAYED }, { expectedCompletionDate: { lt: new Date() }, status: { not: ProjectStatus.COMPLETED } }] }, include: { department: true, contractor: true } }); }
  criticalProjects() { return this.prisma.project.findMany({ where: { healthStatus: HealthStatus.CRITICAL }, include: { department: true, contractor: true, broker: true } }); }
}
