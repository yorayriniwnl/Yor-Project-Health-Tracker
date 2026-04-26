import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
export class CreateContractorDto {
  @IsString() contractorName!: string;
  @IsString() companyName!: string;
  @IsString() registrationNumber!: string;
  @IsNumber() @Min(0) yearsExperience!: number;
  @IsNumber() @Min(0) pastProjectsHandled!: number;
  @IsNumber() @Min(0) totalProjectsDelivered!: number;
  @IsNumber() @Min(0) completedOnTime!: number;
  @IsNumber() @Min(0) completedWithinBudget!: number;
  @IsOptional() @IsNumber() @Min(0) @Max(100) successRate?: number;
  @IsOptional() @IsNumber() @Min(0) @Max(5) qualityRating?: number;
  @IsOptional() @IsBoolean() blacklisted?: boolean;
  @IsOptional() @IsString() disputeHistory?: string;
}
