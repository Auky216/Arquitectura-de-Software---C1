import { IsString, IsIn } from 'class-validator';

export class UpdateDebtStatusDto {
  @IsString()
  @IsIn(['PENDING', 'COMPLETED', 'CANCELLED', 'OVERDUE'])
  status: string;
}