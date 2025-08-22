import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { EnterprisesModule } from './enterprise/enterprises.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule, // ← Esto es crucial
    UsersModule,
    EnterprisesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}