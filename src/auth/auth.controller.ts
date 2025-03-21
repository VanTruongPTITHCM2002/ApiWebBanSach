import { SignUpDto } from './dto/signup.dto';
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
  @ApiBody({ type: [LoginDto] })
  async login(@Body() loginDto: LoginDto): Promise<ApiRes<string>> {
    const accessToken = await this.authService.postLogin(
      loginDto.username,
      loginDto.password,
    );
    return accessToken;
  }

  @Post('signup')
  @ApiCreatedResponse({ description: 'Đăng ký tài khoản' })
  @ApiBody({ type: [SignUpDto] })
  async singup(signUpDto: SignUpDto): Promise<ApiRes<string>> {
    return this.authService.signup(signUpDto);
  }
}
