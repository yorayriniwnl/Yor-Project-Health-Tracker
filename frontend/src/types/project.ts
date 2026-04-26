import type { Broker } from './broker';
import type { Contractor } from './contractor';

export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'DELAYED' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED';
export type HealthStatus = 'HEALTHY' | 'WATCHLIST' | 'CRITICAL';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Department = {
  id: string;
  name: string;
  ministryName: string;
  region?: string;
};

export type Project = {
  id: string;
  projectCode: string;
  projectName: string;
  description?: string | null;
  departmentId: string;
  department?: Department;
  ministry?: string | null;
  location: string;
  projectType: string;
  status: ProjectStatus;
  budgetAllocated: number;
  budgetReleased: number;
  budgetSpent: number;
  budgetRemaining: number;
  startDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string | null;
  expectedDurationDays: number;
  progressPercentage: number;
  contractorId?: string | null;
  contractor?: Contractor | null;
  brokerId?: string | null;
  broker?: Broker | null;
  expectedMaintenanceCost: number;
  actualMaintenanceCost: number;
  annualMaintenanceCost: number;
  healthScore: number;
  healthStatus: HealthStatus;
  riskLevel: RiskLevel;
  riskNotes?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Paginated<T> = { items: T[]; meta: { total: number; page: number; limit: number } };
