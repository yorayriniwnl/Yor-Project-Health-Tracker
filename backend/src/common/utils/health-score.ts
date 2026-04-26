type NumericValue = number | string | { toString(): string } | null;

type ContractorHealth = {
  successRate?: NumericValue;
  totalProjectsDelivered?: NumericValue;
  pastProjectsHandled?: NumericValue;
  completedOnTime?: NumericValue;
  completedWithinBudget?: NumericValue;
  qualityRating?: NumericValue;
  blacklisted?: boolean | null;
  disputeHistory?: string | null;
};

type BrokerHealth = {
  complianceStatus?: string | null;
  conflictOfInterest?: boolean | null;
  riskLevel?: string | null;
  feeAmount?: NumericValue;
};

export type ProjectHealthInput = {
  budgetAllocated: NumericValue;
  budgetSpent: NumericValue;
  budgetReleased?: NumericValue;
  startDate: Date | string;
  expectedCompletionDate: Date | string;
  actualCompletionDate?: Date | string | null;
  expectedDurationDays?: NumericValue;
  progressPercentage: NumericValue;
  expectedMaintenanceCost?: NumericValue;
  actualMaintenanceCost?: NumericValue;
  annualMaintenanceCost?: NumericValue;
  status?: string | null;
  contractor?: ContractorHealth | null;
  broker?: BrokerHealth | null;
  now?: Date;
};

export type ProjectHealthResult = {
  score: number;
  healthStatus: 'HEALTHY' | 'WATCHLIST' | 'CRITICAL';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  breakdown: {
    budgetScore: number;
    timelineScore: number;
    progressScore: number;
    contractorScore: number;
    maintenanceScore: number;
    brokerScore: number;
    budgetUsagePercentage: number;
    timeElapsedPercentage: number;
    delayDays: number;
    maintenancePercentage: number;
  };
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const num = (value: unknown, fallback = 0) => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const days = (start: Date | string, end: Date | string) => Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000);

export function calculateProjectHealth(input: ProjectHealthInput): ProjectHealthResult {
  const now = input.now ?? new Date();
  const budgetAllocated = Math.max(num(input.budgetAllocated), 1);
  const budgetSpent = Math.max(num(input.budgetSpent), 0);
  const progress = clamp(num(input.progressPercentage), 0, 100);
  const startDate = new Date(input.startDate);
  const expectedCompletionDate = new Date(input.expectedCompletionDate);
  const expectedDurationDays = Math.max(num(input.expectedDurationDays, days(startDate, expectedCompletionDate)), 1);
  const elapsedDays = clamp(days(startDate, now), 0, expectedDurationDays * 2);
  const timeElapsedPercentage = clamp((elapsedDays / expectedDurationDays) * 100, 0, 200);
  const budgetUsagePercentage = (budgetSpent / budgetAllocated) * 100;

  // Budget score: strong penalty for overrun or burn rate far ahead of physical progress.
  let budgetScore = 25;
  if (budgetSpent > budgetAllocated) {
    const overrunPct = ((budgetSpent - budgetAllocated) / budgetAllocated) * 100;
    budgetScore = clamp(8 - overrunPct * 0.35, 0, 8);
  } else {
    const allowedBurn = Math.max(progress + 10, timeElapsedPercentage * 0.85);
    const overspendVsProgress = Math.max(0, budgetUsagePercentage - allowedBurn);
    budgetScore = clamp(25 - overspendVsProgress * 0.65, 0, 25);
  }

  // Timeline score: on-time gets full score, delayed work loses score based on delay percentage.
  let delayDays = 0;
  let timelineScore = 25;
  const completed = String(input.status ?? '').toUpperCase() === 'COMPLETED';
  const finishDate = input.actualCompletionDate ? new Date(input.actualCompletionDate) : now;
  if ((!completed && now > expectedCompletionDate) || (completed && finishDate > expectedCompletionDate)) {
    delayDays = Math.max(0, days(expectedCompletionDate, finishDate));
    const delayPct = (delayDays / expectedDurationDays) * 100;
    if (delayPct <= 10) timelineScore = 18;
    else if (delayPct <= 25) timelineScore = 10;
    else timelineScore = clamp(8 - (delayPct - 25) * 0.2, 0, 8);
  }

  // Progress score: compares physical progress with time elapsed.
  const expectedProgress = clamp(timeElapsedPercentage, 0, 100);
  const progressGap = Math.max(0, expectedProgress - progress);
  const progressScore = clamp(20 - progressGap * 0.45, 0, 20);

  // Contractor score.
  const contractor = input.contractor;
  let contractorScore = 8;
  if (contractor) {
    const successRate = clamp(num(contractor.successRate), 0, 100);
    const delivered = Math.max(num(contractor.totalProjectsDelivered), 0);
    const onTimeRate = delivered > 0 ? clamp((num(contractor.completedOnTime) / delivered) * 100, 0, 100) : 0;
    const withinBudgetRate = delivered > 0 ? clamp((num(contractor.completedWithinBudget) / delivered) * 100, 0, 100) : 0;
    const qualityRating = clamp(num(contractor.qualityRating), 0, 5);
    const deliveryDepthBonus = delivered >= 30 ? 1.5 : delivered >= 10 ? 0.8 : 0;
    contractorScore = (successRate / 100) * 5 + (onTimeRate / 100) * 3 + (withinBudgetRate / 100) * 3 + (qualityRating / 5) * 2.5 + deliveryDepthBonus;
    if (contractor.blacklisted) contractorScore = 0;
    if ((contractor.disputeHistory ?? '').toLowerCase().includes('active')) contractorScore -= 2;
    contractorScore = clamp(contractorScore, 0, 15);
  }

  // Maintenance score: lower annual maintenance cost relative to project value is better.
  const annualMaintenanceCost = Math.max(num(input.annualMaintenanceCost, num(input.expectedMaintenanceCost, 0)), 0);
  const maintenancePercentage = (annualMaintenanceCost / budgetAllocated) * 100;
  let maintenanceScore = 10;
  if (maintenancePercentage <= 2) maintenanceScore = 10;
  else if (maintenancePercentage <= 5) maintenanceScore = 8;
  else if (maintenancePercentage <= 10) maintenanceScore = 5;
  else if (maintenancePercentage <= 15) maintenanceScore = 3;
  else maintenanceScore = 1;

  // Broker score: compliant/no broker is fine; high-risk broker or conflict lowers score.
  const broker = input.broker;
  let brokerScore = 5;
  if (broker) {
    const riskLevel = String(broker.riskLevel ?? 'LOW').toUpperCase();
    const compliance = String(broker.complianceStatus ?? 'PENDING').toUpperCase();
    brokerScore = compliance === 'VERIFIED' ? 5 : compliance === 'UNDER_REVIEW' ? 3 : compliance === 'PENDING' ? 2 : 0;
    if (broker.conflictOfInterest) brokerScore -= 2;
    if (riskLevel === 'HIGH') brokerScore -= 2;
    if (riskLevel === 'CRITICAL') brokerScore = 0;
    brokerScore = clamp(brokerScore, 0, 5);
  }

  const score = Math.round(clamp(budgetScore + timelineScore + progressScore + contractorScore + maintenanceScore + brokerScore, 0, 100));
  const healthStatus = score >= 80 ? 'HEALTHY' : score >= 60 ? 'WATCHLIST' : 'CRITICAL';
  const riskLevel = score >= 80 ? 'LOW' : score >= 60 ? 'MEDIUM' : score >= 40 ? 'HIGH' : 'CRITICAL';

  return {
    score,
    healthStatus,
    riskLevel,
    breakdown: {
      budgetScore: Math.round(budgetScore * 10) / 10,
      timelineScore: Math.round(timelineScore * 10) / 10,
      progressScore: Math.round(progressScore * 10) / 10,
      contractorScore: Math.round(contractorScore * 10) / 10,
      maintenanceScore: Math.round(maintenanceScore * 10) / 10,
      brokerScore: Math.round(brokerScore * 10) / 10,
      budgetUsagePercentage: Math.round(budgetUsagePercentage * 10) / 10,
      timeElapsedPercentage: Math.round(timeElapsedPercentage * 10) / 10,
      delayDays,
      maintenancePercentage: Math.round(maintenancePercentage * 100) / 100
    }
  };
}
