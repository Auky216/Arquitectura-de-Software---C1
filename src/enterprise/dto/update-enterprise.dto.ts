import { IsString, IsEmail, IsOptional, IsIn, Length } from 'class-validator';

export class UpdateEnterpriseDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  business_name?: string;

  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
  status?: string;
}