import { IsString, IsEmail, IsOptional, Length } from 'class-validator';

export class CreateEnterpriseDto {
  @IsString()
  @Length(11, 11, { message: 'RUC must be exactly 11 digits' })
  ruc: string;

  @IsString()
  @Length(1, 255)
  business_name: string;

  @IsOptional()
  @IsEmail()
  contact_email?: string;
}