import { IsString, IsEmail, IsOptional, IsIn, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(8, 20)
  document: string;

  @IsString()
  @IsIn(['DNI', 'CE', 'RUC'])
  type: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}