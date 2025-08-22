import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryEnterpriseDto {
  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  size?: string = '10';

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;
}