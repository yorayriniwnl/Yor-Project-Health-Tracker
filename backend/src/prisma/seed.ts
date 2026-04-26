import { PrismaClient, Role, ProjectStatus, ComplianceStatus, RiskLevel, MilestoneStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { calculateProjectHealth } from '../common/utils/health-score';

const prisma = new PrismaClient();

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.projectRisk.deleteMany();
  await prisma.projectDocument.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.broker.deleteMany();
  await prisma.contractor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();

  const healthDept = await prisma.department.create({ data: { name: 'Department of Health', ministryName: 'Ministry of Health', region: 'Bihar' } });
  const roadsDept = await prisma.department.create({ data: { name: 'Public Works Department', ministryName: 'Ministry of Roads', region: 'Assam' } });

  const admin = await prisma.user.create({ data: { fullName: 'Super Admin', email: 'admin@govtrack.local', passwordHash: await bcrypt.hash('Admin@1234', 12), role: Role.SUPER_ADMIN, departmentId: healthDept.id } });
  await prisma.user.create({ data: { fullName: 'Government Admin Health', email: 'health.admin@govtrack.local', passwordHash: await bcrypt.hash('Admin@1234', 12), role: Role.GOVERNMENT_ADMIN, departmentId: healthDept.id } });
  await prisma.user.create({ data: { fullName: 'Project Manager Roads', email: 'pm.roads@govtrack.local', passwordHash: await bcrypt.hash('Admin@1234', 12), role: Role.PROJECT_MANAGER, departmentId: roadsDept.id } });
  await prisma.user.create({ data: { fullName: 'State Auditor', email: 'auditor@govtrack.local', passwordHash: await bcrypt.hash('Admin@1234', 12), role: Role.AUDITOR } });

  const contractor = await prisma.contractor.create({ data: { contractorName: 'BuildWell Infrastructure Ltd.', companyName: 'BuildWell Infrastructure Ltd.', registrationNumber: 'BW-IND-2009', yearsExperience: 12, pastProjectsHandled: 45, totalProjectsDelivered: 38, completedOnTime: 31, completedWithinBudget: 33, successRate: 84.44, qualityRating: 4.2, blacklisted: false, disputeHistory: 'No active disputes' } });
  const contractor2 = await prisma.contractor.create({ data: { contractorName: 'RoadCraft EPC Pvt. Ltd.', companyName: 'RoadCraft EPC Pvt. Ltd.', registrationNumber: 'RC-EPC-2014', yearsExperience: 9, pastProjectsHandled: 28, totalProjectsDelivered: 21, completedOnTime: 14, completedWithinBudget: 16, successRate: 75, qualityRating: 3.8, blacklisted: false, disputeHistory: 'One resolved arbitration' } });

  const broker = await prisma.broker.create({ data: { brokerName: 'ABC Infrastructure Advisors', organization: 'ABC Infrastructure Advisors', role: 'Procurement consultant', feeAmount: 5000000, commissionPercentage: 1, complianceStatus: ComplianceStatus.VERIFIED, conflictOfInterest: false, riskLevel: RiskLevel.LOW, remarks: 'Verified and documented engagement' } });
  const broker2 = await prisma.broker.create({ data: { brokerName: 'NorthStar Advisory', organization: 'NorthStar Advisory LLP', role: 'Technical consultant', feeAmount: 2000000, commissionPercentage: 0.5, complianceStatus: ComplianceStatus.UNDER_REVIEW, conflictOfInterest: true, riskLevel: RiskLevel.HIGH, remarks: 'Conflict declaration under audit review' } });

  const health = calculateProjectHealth({ budgetAllocated: 500000000, budgetSpent: 280000000, budgetReleased: 300000000, startDate: '2025-01-01', expectedCompletionDate: '2026-12-31', expectedDurationDays: 729, progressPercentage: 55, expectedMaintenanceCost: 20000000, annualMaintenanceCost: 20000000, status: ProjectStatus.IN_PROGRESS, contractor, broker });
  const project = await prisma.project.create({ data: { projectCode: 'GPH-2025-0001', projectName: 'District Hospital Upgrade', description: 'Upgrade of district hospital wards, diagnostics, and emergency infrastructure.', departmentId: healthDept.id, location: 'Patna, Bihar', projectType: 'Healthcare Infrastructure', status: ProjectStatus.IN_PROGRESS, budgetAllocated: 500000000, budgetReleased: 300000000, budgetSpent: 280000000, budgetRemaining: 220000000, startDate: new Date('2025-01-01'), expectedCompletionDate: new Date('2026-12-31'), expectedDurationDays: 729, progressPercentage: 55, contractorId: contractor.id, brokerId: broker.id, expectedMaintenanceCost: 20000000, actualMaintenanceCost: 0, annualMaintenanceCost: 20000000, healthScore: health.score, healthStatus: health.healthStatus, riskLevel: health.riskLevel, createdById: admin.id } });

  const health2 = calculateProjectHealth({ budgetAllocated: 220000000, budgetSpent: 205000000, budgetReleased: 180000000, startDate: '2024-03-15', expectedCompletionDate: '2026-02-15', expectedDurationDays: 702, progressPercentage: 62, expectedMaintenanceCost: 25000000, annualMaintenanceCost: 16000000, status: ProjectStatus.DELAYED, contractor: contractor2, broker: broker2 });
  const project2 = await prisma.project.create({ data: { projectCode: 'GPH-2024-0034', projectName: 'North River Bridge Repair', description: 'Structural repair and expansion of key bridge corridor.', departmentId: roadsDept.id, location: 'Guwahati, Assam', projectType: 'Transport Infrastructure', status: ProjectStatus.DELAYED, budgetAllocated: 220000000, budgetReleased: 180000000, budgetSpent: 205000000, budgetRemaining: 15000000, startDate: new Date('2024-03-15'), expectedCompletionDate: new Date('2026-02-15'), expectedDurationDays: 702, progressPercentage: 62, contractorId: contractor2.id, brokerId: broker2.id, expectedMaintenanceCost: 25000000, actualMaintenanceCost: 9000000, annualMaintenanceCost: 16000000, healthScore: health2.score, healthStatus: health2.healthStatus, riskLevel: health2.riskLevel, createdById: admin.id } });

  await prisma.milestone.createMany({ data: [
    { projectId: project.id, milestoneName: 'Civil structure completion', description: 'Ward and emergency block civil works', plannedStartDate: new Date('2025-01-15'), plannedEndDate: new Date('2025-08-31'), actualStartDate: new Date('2025-01-20'), progressPercentage: 100, status: MilestoneStatus.COMPLETED },
    { projectId: project.id, milestoneName: 'Equipment procurement', description: 'Diagnostics and ICU equipment procurement', plannedStartDate: new Date('2025-09-01'), plannedEndDate: new Date('2026-04-30'), progressPercentage: 40, status: MilestoneStatus.IN_PROGRESS },
    { projectId: project2.id, milestoneName: 'Structural audit and reinforcement', description: 'Bridge deck and pier reinforcement', plannedStartDate: new Date('2024-04-01'), plannedEndDate: new Date('2025-09-30'), progressPercentage: 70, status: MilestoneStatus.DELAYED }
  ] });

  await prisma.maintenanceRecord.create({ data: { projectId: project.id, maintenanceType: 'PREVENTIVE', expectedCost: 20000000, actualCost: 0, vendorName: 'MediMaint Services', nextDueDate: new Date('2027-01-30'), riskLevel: RiskLevel.LOW, remarks: 'First-year maintenance planned after commissioning' } });
  await prisma.projectRisk.create({ data: { projectId: project2.id, riskTitle: 'Budget burn rate high', riskDescription: 'Budget usage is ahead of physical progress and broker compliance is under review.', riskLevel: RiskLevel.HIGH, reportedById: admin.id, status: 'OPEN' } });

  console.log('Seed complete. Login with admin@govtrack.local / Admin@1234');
}

main().finally(async () => prisma.$disconnect());
