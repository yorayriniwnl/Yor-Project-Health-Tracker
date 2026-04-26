import { IsOptional, IsString } from 'class-validator';
export class CreateDepartmentDto {
  @IsString() name!: string;
  @IsString() ministryName!: string;
  @IsOptional() @IsString() region?: string;
}
