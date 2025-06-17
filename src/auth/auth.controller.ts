import { SignUpDto } from './dto/signup.dto';
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/response/response.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from 'src/response/auth.response';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Đăng nhập tài khoản' })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ApiRes<string | AuthResponse>> {
    const response = await this.authService.postLogin(
      loginDto.username,
      loginDto.password,
    );

    return response;
  }

  @Post('signup')
  @ApiCreatedResponse({ description: 'Đăng ký tài khoản' })
  async signup(@Body() signUpDto: SignUpDto): Promise<ApiRes<string>> {
    return this.authService.signup(signUpDto);
  }
}
