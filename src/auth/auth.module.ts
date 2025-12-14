import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './auth.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Account } from '@/accounts/entities/account.entity';
import { Role } from '@/roles/entities/role.entity';
import { User } from '@/users/entities/user.entity';
import { AccountsService } from '@/accounts/accounts.service';
import { UsersService } from '@/users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load biến môi trường từ .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([Account, Role, User]),
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy, AccountsService, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
