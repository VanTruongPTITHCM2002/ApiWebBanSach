import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { MessageSuccess } from '@/enum/message.success.enum';
import { MessageError } from '@/enum/message.error.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, { timestamp: true });

  static ATTRIBUTE_TOKEN = 'access_token';

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
    this.logger.log('Bắt đầu thực hiện đăng nhập với tài khoản: ', username);
    try {
      const account = await this.getAccountByUsername(username);

      this.checkPassword(password, account.password);

      const token = await this.generateToken(account);

      this.setTokenCookie(res, token, rememberMe);

      return ApiRes.success(MessageSuccess.LOGIN_SUCCESS);
    } catch (error: any) {
      this.logger.log(
        `Xảy ra lỗi khi đăng nhập tài khoản ${username} : `,
        error.message,
      );
      if (error instanceof NotFoundException) {
        return ApiRes.notFound(error.message);
      }

      if (error instanceof ForbiddenException) {
        return ApiRes.forbidden(error.message);
      }

      if (error instanceof UnauthorizedException) {
        return ApiRes.unauthorized(error.message);
      }

      return ApiRes.internalServerError(MessageError.INTERNAL_SERVER_ERROR);
    } finally {
      this.logger.log(`Kết thúc quá trình đăng nhập với tài khoản ${username}`);
    }
  }

  async logout(res: Response) {
    this.setTokenCookie(res);
    return ApiRes.success(MessageSuccess.LOGOUT_SUCCESS);
  }

  async generateToken(account: Account): Promise<string> {
    const payload = { sub: account.username, role: account.roleId.roleName };
    return this.jwtService.sign(payload);
  }

  async getAccountByUsername(username: string) {
    const account = await this.accountRepository.findOne({
      where: { username: username },
      relations: ['roleId'],
    });

    if (!account) {
      throw new NotFoundException(
        `${MessageError.USERNAME_NOT_FOUND} ${username}`,
      );
    }

    if (!account.status) {
      throw new ForbiddenException(MessageError.USER_NOT_LOGIN);
    }

    return account;
  }

  async checkPassword(
    passwordRequest: string,
    passwordHash: string,
  ): Promise<void> {
    const isMatch = await bcrypt.compare(passwordRequest, passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException(MessageError.USER_INCORRECT);
    }
  }

  async setTokenCookie(res: Response, token?: string, rememberMe?: boolean) {
    if (token) {
      return res.cookie(AuthService.ATTRIBUTE_TOKEN, token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
      });
    }
    return res.cookie(AuthService.ATTRIBUTE_TOKEN, '', {
      httpOnly: true,
      secure: true, // bật nếu dùng HTTPS
      sameSite: 'strict', // hoặc 'Strict' hoặc 'None' nếu cần chia domain
      maxAge: 0,
    });
  }
}
