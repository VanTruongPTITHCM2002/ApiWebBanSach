import { UnauthorizedException } from './../common/exception/unauthorized.exception';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';

import { Response } from 'express';
import { Account } from '@/accounts/entities/account.entity';
import { ApiRes } from '@/response/response.dto';
import { AuthResponse } from '@/response/auth.response';
import { MessageSuccess } from '@/enum/message.success.enum';
import { MessageError } from '@/enum/message.error.enum';
import { ConflictException } from '@/common/exception/conflict.exception';
import { RoleEnum } from '@/enum/role.enum';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { RolesRepository } from '@/roles/repositories/roles.repository';

@Injectable()
export class AuthService {
  static readonly ATTRIBUTE_TOKEN = 'access_token';

  constructor(
    private readonly jwtService: JwtService,
    private readonly accountRepository: AccountsRepository,
    private readonly roleRepository: RolesRepository,
  ) {}

  async signup(signUpDto: SignUpDto): Promise<ApiRes<string>> {
    const { username, password, repassword } = signUpDto;
    const account = await this.getAccountByUsername(username, true);
    this.validateUsernameExists(account);
    this.validateMatchPassword(password, repassword);

    const role = await this.roleRepository.findByName(RoleEnum.USER);
    if (!role) {
      throw new NotFoundException(`Role "${RoleEnum.USER}" not found`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.accountRepository.createWithProfile({
      username,
      password: hashedPassword,
      role,
    });

    return ApiRes.created(`${MessageSuccess.USER_CREATED_SUCESS} ${username}`);
  }

  async postLogin(
    username: string,
    password: string,
    res: Response,
    rememberMe: boolean,
  ): Promise<ApiRes<string | AuthResponse>> {
    const account = await this.getAccountByUsername(username);
    await this.checkPassword(password, account.password);
    const token = await this.generateToken(account);
    this.setTokenCookie(res, token, rememberMe);
    return ApiRes.success(MessageSuccess.LOGIN_SUCCESS);
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
    const account = await this.accountRepository.findByUsername(
      username,
      !isCreated,
    );

    if (!isCreated) {
      if (!account) {
        throw new NotFoundException(MessageError.USERNAME_NOT_FOUND);
      }

      if (!account.isActive) {
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
        path: '/',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
      });
    }
    return res.cookie(AuthService.ATTRIBUTE_TOKEN, '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
  }

  validateUsernameExists(account: Account) {
    if (account) {
      throw new ConflictException(
        `${MessageError.USER_EXISTED} ${account.username}`,
      );
    }
  }

  validateMatchPassword(password: string, repassword: string) {
    if (password !== repassword) {
      throw new UnauthorizedException(MessageError.PASSWORD_NOT_MATCH);
    }
  }
}
