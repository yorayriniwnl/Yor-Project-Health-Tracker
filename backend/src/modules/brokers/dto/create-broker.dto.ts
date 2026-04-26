import { ComplianceStatus, RiskLevel } from '@prisma/client';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreateBrokerDto {
  @IsString() brokerName!: string;
  @IsOptional() @IsString() organization?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsNumber() @Min(0) feeAmount?: number;
  @IsOptional() @IsNumber() @Min(0) commissionPercentage?: number;
  @IsOptional() @IsEnum(ComplianceStatus) complianceStatus?: ComplianceStatus;
  @IsOptional() @IsBoolean() conflictOfInterest?: boolean;
  @IsOptional() @IsEnum(RiskLevel) riskLevel?: RiskLevel;
  @IsOptional() @IsString() remarks?: string;
}
