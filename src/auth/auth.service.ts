import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';

import { Response } from 'express';
import { AccountsService } from '@/accounts/accounts.service';
import { UsersService } from '@/users/users.service';
import { Account } from '@/accounts/entities/account.entity';
import { ApiRes } from '@/response/response.dto';
import { AuthResponse } from '@/response/auth.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly accountService: AccountsService,
    private readonly userService: UsersService,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<ApiRes<string>> {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: signUpDto.username },
      });

      if (account)
        return ApiRes.badRequest(`Tài khoản ${signUpDto.username} đã tồn tại`);

      if (signUpDto.password !== signUpDto.repassword)
        return ApiRes.badRequest('Mật khẩu không trùng khớp');

      const { username, password, firstname, lastname, email, address, phone } =
        signUpDto;

      const newAccount = await this.accountService.create({
        username,
        password,
      });

      const informAccount = this.userService.create({
        firstname,
        lastname,
        email,
        address,
        phone,
        accountId: newAccount,
      });

      if (!newAccount || !informAccount)
        return ApiRes.error('Không thể tạo tài khoản');

      return ApiRes.created(
        `Tài khoản ${signUpDto.username} đã được tạo thành công`,
      );
    } catch (error: any) {
      console.log(error.message);
      return ApiRes.error('Đã có lỗi xảy ra');
    }
  }

  async postLogin(
    username: string,
    password: string,
    res: Response,
    rememberMe: boolean,
  ): Promise<ApiRes<string | AuthResponse>> {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: username },
        relations: ['roleId'],
      });
      if (!account)
        return ApiRes.notFound(`Không tìm thấy tài khoản ${username}`);

      if (!account.status)
        return ApiRes.forbidden('Bạn không thể đăng nhập', 'Thất bại');

      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch)
        return ApiRes.unauthorized('Tài khoản hoặc mật khẩu không đúng');

      const token = await this.generateToken(account);

      res.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
      });

      return ApiRes.success('Đăng nhập thành công');
    } catch (error: any) {
      return ApiRes.error('Đã có lỗi xảy ra trong hệ thống');
    }
  }

  async logout(res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true, // bật nếu dùng HTTPS
      sameSite: 'strict', // hoặc 'Strict' hoặc 'None' nếu cần chia domain
      maxAge: 0,
    });
    return ApiRes.success('Đăng xuất thành công');
  }

  async generateToken(account: Account): Promise<string> {
    const payload = { sub: account.username, role: account.roleId.roleName }; // 'sub' là một payload phổ biến trong JWT
    return this.jwtService.sign(payload);
  }
}
