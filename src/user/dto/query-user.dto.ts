import { IsOptional, IsString, IsNumberString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryUserDto {
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
  type?: string;

  @IsOptional()
  @IsString()
  search?: string;
}