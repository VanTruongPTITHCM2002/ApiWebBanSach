import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccountsService } from 'src/accounts/accounts.service';
import { UsersService } from 'src/users/users.service';
import { ApiRes } from 'src/response/response.dto';
import { SignUpDto } from './dto/signup.dto';

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

      if (account) {
        throw new BadRequestException(`Tài khoản
        ${signUpDto.username} đã tồn tại`);
      }

      if (signUpDto.password !== signUpDto.repassword) {
        throw new BadRequestException('Mật khẩu không trùng khớp');
      }
      const newAccount = await this.accountService.create({
        username: signUpDto.username,
        password: signUpDto.password,
      });

      if (!newAccount) {
        throw new HttpException(
          `Đăng ký tài khoản không thành công`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const informAccount = this.userService.create({
        firstname: signUpDto.firstname,
        lastname: signUpDto.lastname,
        email: signUpDto.email,
        address: signUpDto.address,
        phone: signUpDto.phone,
        accountId: newAccount,
      });
      if (!informAccount) {
        throw new HttpException(
          `Không thể tạo thông tin cá nhân`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return ApiRes.created(
        `Tài khoản ${signUpDto.username} đã được tạo thành công`,
        null,
      );
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return ApiRes.badRequest(error.message, 'Thất bại');
      }
      return ApiRes.error('Đã có lỗi xảy ra', 'Thất bại');
    }
  }

  async postLogin(username: string, password: string): Promise<ApiRes<string>> {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: username },
        relations: ['roleId'],
      });
      if (!account) {
        throw new NotFoundException(`Không tìm thấy tài khoản ${username}`);
      }
      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) {
        throw new UnauthorizedException('Sai mật khẩu!');
      }
      const token = await this.generateToken(account);
      return ApiRes.success('Đăng nhập thành công', token);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return ApiRes.notFound(error.message, 'Thất bại');
      }
      if (error instanceof UnauthorizedException) {
        return ApiRes.unauthorized(error.message, 'Thất bại');
      }
      return ApiRes.error('Đã có lỗi xảy ra', 'Thất bại');
    }
  }

  async generateToken(account: Account): Promise<string> {
    const payload = { sub: account.username, role: account.roleId.roleName }; // 'sub' là một payload phổ biến trong JWT
    return this.jwtService.sign(payload);
  }
}
