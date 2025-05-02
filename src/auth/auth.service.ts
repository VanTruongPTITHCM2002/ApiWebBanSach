import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccountsService } from 'src/accounts/accounts.service';
import { UsersService } from 'src/users/users.service';
import { ApiRes } from 'src/response/response.dto';
import { SignUpDto } from './dto/signup.dto';
import { AuthResponse } from 'src/response/auth.response';

@Injectable()
export class AuthService {
  private log: Logger = new Logger(AuthService.name);
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

      if (account) {
        this.log.error('Tài khoản đăng ký đã tồn tại trên hệ thống');
        return ApiRes.badRequest(
          `Tài khoản ${signUpDto.username} đã tồn tại`,
          'Thất bại',
        );
      }

      if (signUpDto.password !== signUpDto.repassword) {
        this.log.error('Mật khẩu không trùng khớp');
        return ApiRes.badRequest('Mật khẩu không trùng khớp', 'Thất bại');
      }
      const newAccount = await this.accountService.create({
        username: signUpDto.username,
        password: signUpDto.password,
      });

      const informAccount = this.userService.create({
        firstname: signUpDto.firstname,
        lastname: signUpDto.lastname,
        email: signUpDto.email,
        address: signUpDto.address,
        phone: signUpDto.phone,
        accountId: newAccount,
      });

      if (!newAccount || !informAccount) {
        return ApiRes.error('Không thể tạo tài khoản', 'Thất bại');
      }

      this.log.log('Tạo tài khoản thành công');
      return ApiRes.created(
        `Tài khoản ${signUpDto.username} đã được tạo thành công`,
        null,
      );
    } catch (error: any) {
      this.log.error('Đã có lỗi xảy ra khi tạo tài khoản');
      console.log(error.message);
      return ApiRes.error('Đã có lỗi xảy ra', 'Thất bại');
    }
  }

  async postLogin(
    username: string,
    password: string,
  ): Promise<ApiRes<string | AuthResponse>> {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: username },
        relations: ['roleId'],
      });
      if (!account) {
        this.log.error(`Không tìm thấy tài khoản ${username}`);
        return ApiRes.notFound(
          `Không tìm thấy tài khoản ${username}`,
          'Thất bại',
        );
      }
      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) {
        throw new UnauthorizedException('Sai mật khẩu!');
      }
      const response: AuthResponse = {
        access_token: await this.generateToken(account),
      };
      return ApiRes.success('Đăng nhập thành công', response);
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        this.log.error('Sai mật khẩu đăng nhập');
        return ApiRes.unauthorized(error.message, 'Thất bại');
      }
      this.log.error('Dẵ có lỗi xảy ra');
      return ApiRes.error('Đã có lỗi xảy ra', 'Thất bại');
    }
  }

  async generateToken(account: Account): Promise<string> {
    const payload = { sub: account.username, role: account.roleId.roleName }; // 'sub' là một payload phổ biến trong JWT
    return this.jwtService.sign(payload);
  }
}
