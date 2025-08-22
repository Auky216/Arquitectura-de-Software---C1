import { Module } from '@nestjs/common';
import { UserDebtService } from './user-debt.service';
import { UserDebtController } from './user-debt.controller';

@Module({
  controllers: [UserDebtController],
  providers: [UserDebtService],
  exports: [UserDebtService],
})
export class UserDebtModule {}