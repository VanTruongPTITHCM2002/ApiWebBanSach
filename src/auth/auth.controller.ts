import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRes } from 'src/response/response.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Đăng nhập tài khoản' })
  async login(@Body() loginDto: LoginDto): Promise<ApiRes<string>> {
    const accessToken = await this.authService.postLogin(
      loginDto.username,
      loginDto.password,
    );
    return accessToken;
  }

  @Post('signup')
  @ApiCreatedResponse({ description: 'Đăng ký tài khoản' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          description: 'Tên đăng nhập',
        },
        password: {
          type: 'string',
          description: 'Mật khẩu',
        },
        repassword: {
          type: 'string',
          description: 'Nhập lại mật khẩu',
        },
        firstname: {
          type: 'string',
          description: 'Họ',
        },
        lastname: {
          type: 'string',
          description: 'Tên',
        },
        email: {
          type: 'string',
          description: 'Email',
        },
        address: {
          type: 'string',
          description: 'Địa chỉ',
        },
        phone: {
          type: 'string',
          description: 'Số điện thoại',
        },
      },
    },
  })
  async singup(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('repassword') repasssword: string,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Body('email') email: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
  ): Promise<ApiRes<string>> {
    return this.authService.signup(
      username,
      password,
      repasssword,
      firstname,
      lastname,
      email,
      address,
      phone,
    );
  }
}
