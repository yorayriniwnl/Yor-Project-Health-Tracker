import type { Broker } from '@/types/broker';
import type { Contractor } from '@/types/contractor';
import type { Project } from '@/types/project';

export const contractors: Contractor[] = [
  {
    id: 'ctr-buildwell',
    contractorName: 'BuildWell Infrastructure Ltd.',
    companyName: 'BuildWell Infrastructure Ltd.',
    registrationNumber: 'BW-IND-2009',
    yearsExperience: 12,
    pastProjectsHandled: 45,
    totalProjectsDelivered: 38,
    completedOnTime: 31,
    completedWithinBudget: 33,
    successRate: 84.4,
    qualityRating: 4.2,
    blacklisted: false,
    disputeHistory: 'No active disputes',
    currentAssignedProjects: 3
  },
  {
    id: 'ctr-roadcraft',
    contractorName: 'RoadCraft EPC Pvt. Ltd.',
    companyName: 'RoadCraft EPC Pvt. Ltd.',
    registrationNumber: 'RC-EPC-2014',
    yearsExperience: 9,
    pastProjectsHandled: 28,
    totalProjectsDelivered: 21,
    completedOnTime: 14,
    completedWithinBudget: 16,
    successRate: 75,
    qualityRating: 3.8,
    blacklisted: false,
    disputeHistory: 'One resolved arbitration',
    currentAssignedProjects: 2
  }
];

export const brokers: Broker[] = [
  {
    id: 'br-abc',
    brokerName: 'ABC Infrastructure Advisors',
    organization: 'ABC Infrastructure Advisors',
    role: 'Procurement consultant',
    feeAmount: 5000000,
    commissionPercentage: 1,
    complianceStatus: 'VERIFIED',
    conflictOfInterest: false,
    riskLevel: 'LOW',
    remarks: 'Verified and documented engagement'
  },
  {
    id: 'br-north',
    brokerName: 'NorthStar Advisory',
    organization: 'NorthStar Advisory LLP',
    role: 'Technical consultant',
    feeAmount: 2000000,
    commissionPercentage: 0.5,
    complianceStatus: 'UNDER_REVIEW',
    conflictOfInterest: true,
    riskLevel: 'HIGH',
    remarks: 'Conflict declaration under audit review'
  }
];

export const projects: Project[] = [
  {
    id: 'proj-hospital',
    projectCode: 'GPH-2025-0001',
    projectName: 'District Hospital Upgrade',
    description: 'Upgrade of district hospital wards, diagnostics, and emergency infrastructure.',
    department: { id: 'dept-health', name: 'Department of Health', ministryName: 'Ministry of Health' },
    departmentId: 'dept-health',
    location: 'Patna, Bihar',
    projectType: 'Healthcare Infrastructure',
    status: 'IN_PROGRESS',
    budgetAllocated: 500000000,
    budgetReleased: 300000000,
    budgetSpent: 280000000,
    budgetRemaining: 220000000,
    startDate: '2025-01-01',
    expectedCompletionDate: '2026-12-31',
    expectedDurationDays: 729,
    progressPercentage: 55,
    contractor: contractors[0],
    broker: brokers[0],
    expectedMaintenanceCost: 20000000,
    actualMaintenanceCost: 0,
    annualMaintenanceCost: 20000000,
    healthScore: 82,
    healthStatus: 'HEALTHY',
    riskLevel: 'LOW'
  },
  {
    id: 'proj-bridge',
    projectCode: 'GPH-2024-0034',
    projectName: 'North River Bridge Repair',
    description: 'Structural repair and expansion of key bridge corridor.',
    department: { id: 'dept-pwd', name: 'Public Works Department', ministryName: 'Ministry of Roads' },
    departmentId: 'dept-pwd',
    location: 'Guwahati, Assam',
    projectType: 'Transport Infrastructure',
    status: 'DELAYED',
    budgetAllocated: 220000000,
    budgetReleased: 180000000,
    budgetSpent: 205000000,
    budgetRemaining: 15000000,
    startDate: '2024-03-15',
    expectedCompletionDate: '2026-02-15',
    expectedDurationDays: 702,
    progressPercentage: 62,
    contractor: contractors[1],
    broker: brokers[1],
    expectedMaintenanceCost: 25000000,
    actualMaintenanceCost: 9000000,
    annualMaintenanceCost: 16000000,
    healthScore: 57,
    healthStatus: 'CRITICAL',
    riskLevel: 'HIGH'
  }
];
