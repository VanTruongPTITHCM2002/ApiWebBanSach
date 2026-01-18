import {
  BadRequestException,
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
      this.logger.log(
        'Bắt đầu quá trình đăng ký tài khoản: ',
        signUpDto.username,
      );
      const account = await this.getAccountByUsername(signUpDto.username, true);
      this.validateUsernameExsists(account);
      this.validateMatchPassword(signUpDto.password, signUpDto.repassword);

      const { username, password } = signUpDto;

      await this.accountService.create({
        username,
        password,
      });

      return ApiRes.created(
        `Tài khoản ${signUpDto.username} đã được tạo thành công`,
      );
    } catch (error: any) {
      this.logger.log(error.message);
      if (error instanceof BadRequestException) {
        return ApiRes.badRequest(error.message);
      }

      return ApiRes.internalServerError(MessageError.INTERNAL_SERVER_ERROR);
    } finally {
      this.logger.log(
        `Kết thúc quá trình đăng ký tài khoản: ${signUpDto.username}`,
      );
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

      await this.checkPassword(password, account.password);

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

  async getAccountByUsername(username: string, isCreated = false) {
    const account = await this.accountRepository.findOne({
      where: { username: username },
      relations: ['roleId'],
    });

    if (!isCreated) {
      if (!account) {
        throw new NotFoundException(
          `${MessageError.USERNAME_NOT_FOUND} ${username}`,
        );
      }

      if (!account.status) {
        throw new ForbiddenException(MessageError.USER_NOT_LOGIN);
      }
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

  validateUsernameExsists(account: Account) {
    if (account) {
      throw new BadRequestException(`Tài khoản ${account.username} đã tồn tại`);
    }
  }

  validateMatchPassword(password: string, repassword: string) {
    if (password !== repassword) {
      throw new BadRequestException('Mật khẩu không trùng khớp');
    }
  }
}
