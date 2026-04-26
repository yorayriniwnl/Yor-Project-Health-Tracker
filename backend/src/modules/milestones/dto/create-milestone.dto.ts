import { MilestoneStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
export class CreateMilestoneDto {
  @IsString() milestoneName!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() plannedStartDate?: string;
  @IsOptional() @IsDateString() plannedEndDate?: string;
  @IsOptional() @IsDateString() actualStartDate?: string;
  @IsOptional() @IsDateString() actualEndDate?: string;
  @IsOptional() @IsNumber() @Min(0) @Max(100) progressPercentage?: number;
  @IsOptional() @IsEnum(MilestoneStatus) status?: MilestoneStatus;
}
