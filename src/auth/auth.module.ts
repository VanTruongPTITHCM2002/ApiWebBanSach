import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './auth.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { AccountsService } from 'src/accounts/accounts.service';

import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: 'vantruong123456789', // Thay đổi thành khóa bí mật của bạn
      signOptions: { expiresIn: '60m' }, // Thay đổi thời gian hết hạn nếu cần
    }),
    TypeOrmModule.forFeature([Account, Role]),
  ],
  providers: [AuthService, JwtStrategy, AccountsService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
