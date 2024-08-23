import {
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
import { ApiResponse } from 'src/response/apires';
import { Builder } from 'builder-pattern';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly accountService: AccountsService,
    private readonly userService: UsersService,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async signup(
    username: string,
    password: string,
    repassword: string,
    firstname: string,
    lastname: string,
    email: string,
    address: string,
    phone: string,
  ): Promise<ApiResponse<string>> {
    const account = await this.accountRepository.findOne({
      where: { username: username },
    });
    if (account) {
      throw new HttpException(`${username} đã tồn tại`, HttpStatus.BAD_REQUEST);
    }

    if (password !== repassword) {
      throw new HttpException(
        `Mật khẩu không trùng khớp`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newAccount = await this.accountService.create({
      username: username,
      password: password,
    });

    if (!newAccount) {
      throw new HttpException(
        `Đăng ký tài khoản không thành công`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const informAccount = this.userService.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      address: address,
      phone: phone,
      accountId: newAccount,
    });
    if (!informAccount) {
      throw new HttpException(
        `Không thể tạo thông tin cá nhân`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    // return   new ApiResponse(
    //   HttpStatus.CREATED,
    //   `Tài khoản ${username} đã được tạo thành công`,
    //   '',
    // );
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.CREATED)
      .message(`Tài khoản ${username} đã được tạo thành công`)
      .data(null)
      .build();
  }

  async postLogin(username: string, password: string): Promise<string> {
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
    return this.generateToken(account);
  }

  async generateToken(account: Account): Promise<string> {
    const payload = { sub: account.username, role: account.roleId.roleName }; // 'sub' là một payload phổ biến trong JWT
    return this.jwtService.sign(payload);
  }
}
