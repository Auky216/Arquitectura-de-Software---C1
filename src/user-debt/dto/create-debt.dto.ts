import { IsString, IsDecimal, IsOptional, IsDateString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDebtDto {
  @IsString()
  @Length(11, 11, { message: 'Enterprise RUC must be exactly 11 digits' })
  enterprise_ruc: string;

  @IsDecimal({ decimal_digits: '0,2' }, { message: 'Debt amount must have max 2 decimal places' })
  @Type(() => Number)
  debt_amount: number;

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsString()
  status?: string;
}