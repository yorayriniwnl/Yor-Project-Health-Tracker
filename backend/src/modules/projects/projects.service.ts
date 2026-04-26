import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { HealthStatus, ProjectStatus, RiskLevel } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { calculateProjectHealth } from '../../common/utils/health-score';
import { daysBetween, pagination, sort, toNumber } from '../../common/utils/query';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

const includeProject = {
  department: true,
  contractor: true,
  broker: true,
  milestones: true,
  maintenanceRecords: true,
  documents: true,
  risks: true,
  createdBy: { select: { id: true, fullName: true, email: true, role: true } }
};

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: Record<string, unknown>) {
    const { page, limit, skip } = pagination(query);
    const where: any = {};
    if (query.departmentId) where.departmentId = String(query.departmentId);
    if (query.status) where.status = String(query.status).toUpperCase();
    if (query.healthStatus) where.healthStatus = String(query.healthStatus).toUpperCase();
    if (query.contractorId) where.contractorId = String(query.contractorId);
    if (query.location) where.location = { contains: String(query.location), mode: 'insensitive' };
    if (query.projectType) where.projectType = { contains: String(query.projectType), mode: 'insensitive' };
    if (query.minBudget || query.maxBudget) where.budgetAllocated = { gte: query.minBudget ? Number(query.minBudget) : undefined, lte: query.maxBudget ? Number(query.maxBudget) : undefined };
    const searchTerm = query.search ?? query.q;
    if (searchTerm) where.OR = [
      { projectName: { contains: String(searchTerm), mode: 'insensitive' } },
      { projectCode: { contains: String(searchTerm), mode: 'insensitive' } },
      { location: { contains: String(searchTerm), mode: 'insensitive' } },
      { projectType: { contains: String(searchTerm), mode: 'insensitive' } }
    ];
    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({ where, skip, take: limit, orderBy: sort(query, 'createdAt'), include: includeProject }),
      this.prisma.project.count({ where })
    ]);
    return { items, meta: { total, page, limit } };
  }

  async publicList(query: Record<string, unknown>) {
    const { page, limit, skip } = pagination(query);
    const where: any = {};
    if (query.status) where.status = String(query.status).toUpperCase();
    if (query.healthStatus) where.healthStatus = String(query.healthStatus).toUpperCase();
    const searchTerm = query.search ?? query.q;
    if (searchTerm) where.OR = [
      { projectName: { contains: String(searchTerm), mode: 'insensitive' } },
      { projectCode: { contains: String(searchTerm), mode: 'insensitive' } },
      { location: { contains: String(searchTerm), mode: 'insensitive' } },
      { projectType: { contains: String(searchTerm), mode: 'insensitive' } }
    ];
    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          projectCode: true,
          projectName: true,
          department: { select: { id: true, name: true, ministryName: true } },
          location: true,
          projectType: true,
          status: true,
          budgetAllocated: true,
          progressPercentage: true,
          expectedCompletionDate: true,
          healthStatus: true
        }
      }),
      this.prisma.project.count({ where })
    ]);
    return { items, meta: { total, page, limit } };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id }, include: includeProject });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async create(dto: CreateProjectDto, userId: string) {
    this.validateTimeline(dto.startDate, dto.expectedCompletionDate);
    this.validateContractorRequirement(dto.status ?? ProjectStatus.PLANNED, dto.contractorId);
    this.validateBudget(dto.budgetAllocated, dto.budgetSpent ?? 0, Boolean(dto.overrunApproved));
    const { riskNotes, overrunApproved, ...projectFields } = dto;
    const health = await this.computeHealth(projectFields);
    const budgetSpent = dto.budgetSpent ?? 0;
    const data: any = {
      ...projectFields,
      projectCode: dto.projectCode ?? `GPH-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
      status: dto.status ?? ProjectStatus.PLANNED,
      budgetReleased: dto.budgetReleased ?? 0,
      budgetSpent,
      budgetRemaining: dto.budgetAllocated - budgetSpent,
      startDate: new Date(dto.startDate),
      expectedCompletionDate: new Date(dto.expectedCompletionDate),
      actualCompletionDate: dto.actualCompletionDate ? new Date(dto.actualCompletionDate) : undefined,
      expectedDurationDays: dto.expectedDurationDays ?? daysBetween(dto.startDate, dto.expectedCompletionDate),
      progressPercentage: dto.progressPercentage ?? 0,
      expectedMaintenanceCost: dto.expectedMaintenanceCost ?? 0,
      actualMaintenanceCost: dto.actualMaintenanceCost ?? 0,
      annualMaintenanceCost: dto.annualMaintenanceCost ?? dto.expectedMaintenanceCost ?? 0,
      healthScore: health.score,
      healthStatus: health.healthStatus as HealthStatus,
      riskLevel: health.riskLevel as RiskLevel,
      createdById: userId
    };

    const project = await this.prisma.project.create({ data, include: includeProject });
    if (riskNotes) {
      await this.prisma.projectRisk.create({ data: { projectId: project.id, riskTitle: 'Initial risk notes', riskDescription: riskNotes, riskLevel: project.riskLevel, reportedById: userId } });
    }
    await this.audit(userId, 'CREATE_PROJECT', 'Project', project.id, null, project);
    return this.findOne(project.id);
  }

  async update(id: string, dto: UpdateProjectDto, userId: string) {
    const existing = await this.findOne(id);
    this.validateContractorRequirement(dto.status ?? existing.status, dto.contractorId ?? existing.contractorId ?? undefined);
    if (dto.startDate || dto.expectedCompletionDate) this.validateTimeline(dto.startDate ?? existing.startDate.toISOString(), dto.expectedCompletionDate ?? existing.expectedCompletionDate.toISOString());
    if (dto.budgetAllocated !== undefined || dto.budgetSpent !== undefined) this.validateBudget(dto.budgetAllocated ?? toNumber(existing.budgetAllocated), dto.budgetSpent ?? toNumber(existing.budgetSpent), Boolean(dto.overrunApproved));
    const merged: any = { ...existing, ...dto };
    const health = await this.computeHealth(merged);
    const { riskNotes, overrunApproved, ...fields } = dto;
    const data: any = {
      ...fields,
      budgetRemaining: toNumber(dto.budgetAllocated ?? existing.budgetAllocated) - toNumber(dto.budgetSpent ?? existing.budgetSpent),
      healthScore: health.score,
      healthStatus: health.healthStatus as HealthStatus,
      riskLevel: health.riskLevel as RiskLevel
    };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.expectedCompletionDate) data.expectedCompletionDate = new Date(dto.expectedCompletionDate);
    if (dto.actualCompletionDate) data.actualCompletionDate = new Date(dto.actualCompletionDate);
    const project = await this.prisma.project.update({ where: { id }, data, include: includeProject });
    if (riskNotes) await this.prisma.projectRisk.create({ data: { projectId: id, riskTitle: 'Project update risk notes', riskDescription: riskNotes, riskLevel: project.riskLevel, reportedById: userId } });
    await this.audit(userId, 'UPDATE_PROJECT', 'Project', id, existing, project);
    return project;
  }

  async updateStatus(id: string, status: ProjectStatus, userId: string) {
    const old = await this.findOne(id);
    this.validateContractorRequirement(status, old.contractorId);
    const health = calculateProjectHealth({ ...old, status, contractor: old.contractor, broker: old.broker });
    const updated = await this.prisma.project.update({
      where: { id },
      data: { status, healthScore: health.score, healthStatus: health.healthStatus, riskLevel: health.riskLevel },
      include: includeProject
    });
    await this.audit(userId, 'UPDATE_PROJECT_STATUS', 'Project', id, { status: old.status }, { status, healthScore: health.score, healthStatus: health.healthStatus });
    return updated;
  }

  async updateProgress(id: string, progressPercentage: number, userId: string) {
    if (progressPercentage < 0 || progressPercentage > 100) throw new BadRequestException('Progress must be between 0 and 100');
    return this.update(id, { progressPercentage }, userId);
  }

  async health(id: string) {
    const project = await this.findOne(id);
    const result = calculateProjectHealth({ ...project, contractor: project.contractor, broker: project.broker });
    return { projectId: id, score: project.healthScore, healthStatus: project.healthStatus, currentBreakdown: result.breakdown };
  }

  async recalculateHealth(id: string, userId: string) {
    const project = await this.findOne(id);
    const health = calculateProjectHealth({ ...project, contractor: project.contractor, broker: project.broker });
    const updated = await this.prisma.project.update({ where: { id }, data: { healthScore: health.score, healthStatus: health.healthStatus, riskLevel: health.riskLevel }, include: includeProject });
    await this.audit(userId, 'RECALCULATE_HEALTH', 'Project', id, { healthScore: project.healthScore, healthStatus: project.healthStatus }, { healthScore: health.score, healthStatus: health.healthStatus, breakdown: health.breakdown });
    return updated;
  }


  async addRisk(id: string, body: { riskTitle: string; riskDescription?: string; riskLevel?: RiskLevel; status?: string; resolutionNotes?: string }, userId: string) {
    await this.findOne(id);
    const risk = await this.prisma.projectRisk.create({
      data: {
        projectId: id,
        riskTitle: body.riskTitle,
        riskDescription: body.riskDescription,
        riskLevel: body.riskLevel ?? RiskLevel.MEDIUM,
        status: body.status ?? 'OPEN',
        resolutionNotes: body.resolutionNotes,
        reportedById: userId
      }
    });
    await this.audit(userId, 'ADD_PROJECT_RISK', 'Project', id, null, risk);
    return risk;
  }

  async remove(id: string, userId: string) {
    const old = await this.findOne(id);
    const removed = await this.prisma.project.delete({ where: { id } });
    await this.audit(userId, 'DELETE_PROJECT', 'Project', id, old, removed);
    return removed;
  }

  private async computeHealth(dto: any) {
    const contractor = dto.contractorId ? await this.prisma.contractor.findUnique({ where: { id: dto.contractorId } }) : dto.contractor;
    const broker = dto.brokerId ? await this.prisma.broker.findUnique({ where: { id: dto.brokerId } }) : dto.broker;
    return calculateProjectHealth({
      budgetAllocated: dto.budgetAllocated,
      budgetSpent: dto.budgetSpent ?? 0,
      budgetReleased: dto.budgetReleased ?? 0,
      startDate: dto.startDate,
      expectedCompletionDate: dto.expectedCompletionDate,
      actualCompletionDate: dto.actualCompletionDate,
      expectedDurationDays: dto.expectedDurationDays ?? daysBetween(dto.startDate, dto.expectedCompletionDate),
      progressPercentage: dto.progressPercentage ?? 0,
      expectedMaintenanceCost: dto.expectedMaintenanceCost ?? 0,
      actualMaintenanceCost: dto.actualMaintenanceCost ?? 0,
      annualMaintenanceCost: dto.annualMaintenanceCost ?? dto.expectedMaintenanceCost ?? 0,
      status: dto.status,
      contractor,
      broker
    });
  }

  private validateContractorRequirement(status: ProjectStatus | string, contractorId?: string | null) {
    const activeStatuses: ProjectStatus[] = [ProjectStatus.IN_PROGRESS, ProjectStatus.DELAYED, ProjectStatus.COMPLETED, ProjectStatus.SUSPENDED];
    if (activeStatuses.includes(status as ProjectStatus) && !contractorId) {
      throw new BadRequestException('Contractor is required for active projects');
    }
  }

  private validateBudget(allocated: number, spent: number, allowOverrun = false) {
    if (allocated <= 0) throw new BadRequestException('Budget allocated must be greater than zero');
    if (spent < 0) throw new BadRequestException('Budget spent cannot be negative');
    if (!allowOverrun && spent > allocated) throw new BadRequestException('Budget spent cannot exceed budget allocated unless overrun is explicitly approved');
  }

  private validateTimeline(start: string, expected: string) {
    if (new Date(expected) <= new Date(start)) throw new BadRequestException('Expected completion date must be after start date');
  }

  private audit(userId: string, action: string, entityType: string, entityId: string, oldValue: unknown, newValue: unknown) {
    return this.prisma.auditLog.create({ data: { userId, action, entityType, entityId, oldValue: oldValue as any, newValue: newValue as any } });
  }
}
