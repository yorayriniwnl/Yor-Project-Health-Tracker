import { MaintenanceType, RiskLevel } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreateMaintenanceDto {
  @IsOptional() @IsEnum(MaintenanceType) maintenanceType?: MaintenanceType;
  @IsNumber() @Min(0) expectedCost!: number;
  @IsOptional() @IsNumber() @Min(0) actualCost?: number;
  @IsOptional() @IsString() vendorName?: string;
  @IsOptional() @IsDateString() maintenanceDate?: string;
  @IsOptional() @IsDateString() nextDueDate?: string;
  @IsOptional() @IsEnum(RiskLevel) riskLevel?: RiskLevel;
  @IsOptional() @IsString() remarks?: string;
}
