import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { EnterprisesModule } from './enterprise/enterprises.module';
import { UserDebtModule } from './user-debt/user-debt.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule, // ← Esto es crucial
    UsersModule,
    EnterprisesModule,
    UserDebtModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}