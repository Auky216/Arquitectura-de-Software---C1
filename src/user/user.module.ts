import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Para usar en otros módulos
})
export class UsersModule {}