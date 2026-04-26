export type Broker = {
  id: string;
  brokerName: string;
  organization: string;
  role: string;
  feeAmount: number;
  commissionPercentage: number;
  complianceStatus: 'VERIFIED' | 'PENDING' | 'UNDER_REVIEW' | 'NON_COMPLIANT';
  conflictOfInterest: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  remarks?: string | null;
};
