export type Contractor = {
  id: string;
  contractorName: string;
  companyName: string;
  registrationNumber: string;
  yearsExperience: number;
  pastProjectsHandled: number;
  totalProjectsDelivered: number;
  completedOnTime: number;
  completedWithinBudget: number;
  successRate: number;
  qualityRating: number;
  blacklisted: boolean;
  disputeHistory?: string | null;
  currentAssignedProjects?: number;
};
