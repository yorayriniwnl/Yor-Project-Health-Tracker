import { Injectable } from '@nestjs/common';
import { HealthStatus, ProjectStatus } from '@prisma/client';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async projectsByType(type: string, query: Record<string, unknown>) {
    const where = this.buildProjectWhere(type, query);
    let projects = await this.prisma.project.findMany({ where, include: { department: true, contractor: true, broker: true }, orderBy: { updatedAt: 'desc' } });
    if (type === 'over-budget-projects') projects = projects.filter((project) => Number(project.budgetSpent) > Number(project.budgetAllocated));
    if (type === 'maintenance-heavy-projects') projects = projects.filter((project) => (Number(project.annualMaintenanceCost) / Math.max(Number(project.budgetAllocated), 1)) * 100 >= 5);
    return projects;
  }

  healthyProjects(query: Record<string, unknown>) { return this.projectsByType('healthy-projects', query); }
  criticalProjects(query: Record<string, unknown>) { return this.projectsByType('critical-projects', query); }
  delayedProjects(query: Record<string, unknown>) { return this.projectsByType('delayed-projects', query); }
  overBudgetProjects(query: Record<string, unknown>) { return this.projectsByType('over-budget-projects', query); }
  completedProjects(query: Record<string, unknown>) { return this.projectsByType('completed-projects', query); }
  maintenanceHeavyProjects(query: Record<string, unknown>) { return this.projectsByType('maintenance-heavy-projects', query); }
  async budgetUtilization(query: Record<string, unknown>) {
    const projects = await this.projectsByType('budget-utilization', query);
    return projects.map((project: any) => ({
      projectCode: project.projectCode,
      projectName: project.projectName,
      department: project.department?.name,
      budgetAllocated: project.budgetAllocated,
      budgetReleased: project.budgetReleased,
      budgetSpent: project.budgetSpent,
      budgetRemaining: project.budgetRemaining,
      budgetUsagePercentage: Math.round((Number(project.budgetSpent) / Math.max(Number(project.budgetAllocated), 1)) * 1000) / 10,
      healthScore: project.healthScore,
      healthStatus: project.healthStatus
    }));
  }
  async publicTransparency(query: Record<string, unknown>) {
    const projects = await this.projectsByType('public-transparency', query);
    return projects.map((project: any) => ({
      projectCode: project.projectCode,
      projectName: project.projectName,
      department: project.department?.name,
      ministryName: project.department?.ministryName,
      location: project.location,
      projectType: project.projectType,
      budgetAllocated: project.budgetAllocated,
      progressPercentage: project.progressPercentage,
      status: project.status,
      expectedCompletionDate: project.expectedCompletionDate,
      healthStatus: project.healthStatus
    }));
  }
  contractorPerformance() { return this.prisma.contractor.findMany({ orderBy: [{ successRate: 'desc' }, { totalProjectsDelivered: 'desc' }], include: { _count: { select: { projects: true } } } }); }
  brokerRisk() { return this.prisma.broker.findMany({ where: { OR: [{ riskLevel: { in: ['HIGH', 'CRITICAL'] as any } }, { conflictOfInterest: true }, { complianceStatus: { in: ['UNDER_REVIEW', 'NON_COMPLIANT'] as any } }] }, include: { projects: true } }); }

  async departmentPerformance() {
    const departments = await this.prisma.department.findMany({ include: { projects: true } });
    return departments.map((department) => ({
      department: department.name,
      ministryName: department.ministryName,
      projectCount: department.projects.length,
      budgetAllocated: department.projects.reduce((sum, item) => sum + Number(item.budgetAllocated), 0),
      budgetSpent: department.projects.reduce((sum, item) => sum + Number(item.budgetSpent), 0),
      delayedProjects: department.projects.filter((item) => item.status === ProjectStatus.DELAYED).length,
      averageHealthScore: department.projects.reduce((sum, item) => sum + item.healthScore, 0) / Math.max(department.projects.length, 1)
    }));
  }

  async export(type: string, format: string, query: Record<string, unknown>) {
    const rows = await this.rowsForExport(type, query);
    if (format === 'xlsx') return this.toExcel(rows);
    if (format === 'pdf') return this.toPdf(rows, type);
    return Buffer.from(this.toCsv(rows));
  }

  private async rowsForExport(type: string, query: Record<string, unknown>) {
    if (type === 'contractor-performance') {
      const contractors = await this.contractorPerformance();
      return contractors.map((contractor: any) => ({
        contractorName: contractor.contractorName,
        companyName: contractor.companyName,
        registrationNumber: contractor.registrationNumber,
        yearsExperience: contractor.yearsExperience,
        pastProjectsHandled: contractor.pastProjectsHandled,
        totalProjectsDelivered: contractor.totalProjectsDelivered,
        completedOnTime: contractor.completedOnTime,
        completedWithinBudget: contractor.completedWithinBudget,
        successRate: contractor.successRate,
        qualityRating: contractor.qualityRating,
        blacklisted: contractor.blacklisted,
        currentAssignedProjects: contractor._count?.projects ?? 0
      }));
    }
    if (type === 'broker-risk') {
      const brokers = await this.brokerRisk();
      return brokers.map((broker: any) => ({
        brokerName: broker.brokerName,
        organization: broker.organization,
        role: broker.role,
        feeAmount: String(broker.feeAmount),
        commissionPercentage: broker.commissionPercentage,
        complianceStatus: broker.complianceStatus,
        conflictOfInterest: broker.conflictOfInterest,
        riskLevel: broker.riskLevel,
        linkedProjects: broker.projects?.length ?? 0,
        remarks: broker.remarks ?? ''
      }));
    }
    if (type === 'department-performance') return this.departmentPerformance();
    if (type === 'budget-utilization') return this.budgetUtilization(query);
    if (type === 'public-transparency') return this.publicTransparency(query);

    const data = await this.projectsByType(type, query);
    return data.map((project: any) => ({
      projectCode: project.projectCode,
      projectName: project.projectName,
      department: project.department?.name,
      location: project.location,
      status: project.status,
      healthStatus: project.healthStatus,
      healthScore: project.healthScore,
      budgetAllocated: String(project.budgetAllocated),
      budgetSpent: String(project.budgetSpent),
      progressPercentage: project.progressPercentage,
      expectedCompletionDate: project.expectedCompletionDate?.toISOString?.() ?? project.expectedCompletionDate
    }));
  }

  private buildProjectWhere(type: string, query: Record<string, unknown>) {
    const where: any = {};
    if (query.departmentId) where.departmentId = String(query.departmentId);
    if (query.location) where.location = { contains: String(query.location), mode: 'insensitive' };
    if (query.contractorId) where.contractorId = String(query.contractorId);
    if (query.healthStatus) where.healthStatus = String(query.healthStatus).toUpperCase();
    if (query.from || query.to) where.createdAt = { gte: query.from ? new Date(String(query.from)) : undefined, lte: query.to ? new Date(String(query.to)) : undefined };
    if (type === 'healthy-projects') where.healthStatus = HealthStatus.HEALTHY;
    if (type === 'critical-projects') where.healthStatus = HealthStatus.CRITICAL;
    if (type === 'delayed-projects') where.OR = [{ status: ProjectStatus.DELAYED }, { expectedCompletionDate: { lt: new Date() }, status: { not: ProjectStatus.COMPLETED } }];
    if (type === 'completed-projects') where.status = ProjectStatus.COMPLETED;
    if (type === 'maintenance-heavy-projects') where.annualMaintenanceCost = { gt: 0 };
    return where;
  }

  private toCsv(rows: Record<string, unknown>[]) {
    if (!rows.length) return '';
    const headers = Object.keys(rows[0]);
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    return [headers.join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
  }

  private async toExcel(rows: Record<string, unknown>[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
    worksheet.columns = Object.keys(rows[0] ?? { empty: '' }).map((key) => ({ header: key, key, width: 24 }));
    worksheet.addRows(rows);
    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  private toPdf(rows: Record<string, unknown>[], title: string) {
    return new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.fontSize(18).text(`Government Project Health Tracker - ${title}`, { underline: true });
      doc.moveDown();
      rows.slice(0, 100).forEach((row, index) => {
        const line = Object.entries(row).slice(0, 8).map(([key, value]) => `${key}: ${value ?? ''}`).join(' | ');
        doc.fontSize(10).text(`${index + 1}. ${line}`);
      });
      doc.end();
    });
  }
}
