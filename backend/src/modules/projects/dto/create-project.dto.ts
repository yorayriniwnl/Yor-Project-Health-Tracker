import { ProjectStatus } from '@prisma/client';
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateProjectDto {
  @IsOptional() @IsString() projectCode?: string;
  @IsString() projectName!: string;
  @IsOptional() @IsString() description?: string;
  @IsString() departmentId!: string;
  @IsString() location!: string;
  @IsString() projectType!: string;
  @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus;
  @IsNumber() @Min(1) budgetAllocated!: number;
  @IsOptional() @IsNumber() @Min(0) budgetReleased?: number;
  @IsOptional() @IsNumber() @Min(0) budgetSpent?: number;
  @IsDateString() startDate!: string;
  @IsDateString() expectedCompletionDate!: string;
  @IsOptional() @IsDateString() actualCompletionDate?: string;
  @IsOptional() @IsNumber() @Min(1) expectedDurationDays?: number;
  @IsOptional() @IsNumber() @Min(0) @Max(100) progressPercentage?: number;
  @IsOptional() @IsString() contractorId?: string;
  @IsOptional() @IsString() brokerId?: string;
  @IsOptional() @IsNumber() @Min(0) expectedMaintenanceCost?: number;
  @IsOptional() @IsNumber() @Min(0) actualMaintenanceCost?: number;
  @IsOptional() @IsNumber() @Min(0) annualMaintenanceCost?: number;
  @IsOptional() @IsString() riskNotes?: string;
  @IsOptional() @IsBoolean() overrunApproved?: boolean;
}
