import { SignUpDto } from './dto/signup.dto';
import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiRes } from '@/response/response.dto';
import { AuthResponse } from '@/response/auth.response';
import { AuthGuard } from '@/common/guards/auth.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Đăng nhập tài khoản' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiRes<string | AuthResponse>> {
    const response = await this.authService.postLogin(
      loginDto.username,
      loginDto.password,
      res,
      loginDto.rememberMe ?? false,
    );

    return response;
  }

  @Post('signup')
  @ApiCreatedResponse({ description: 'Đăng ký tài khoản' })
  async signup(@Body() signUpDto: SignUpDto): Promise<ApiRes<string>> {
    return this.authService.signup(signUpDto);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    const response = this.authService.logout(res);
    return response;
  }

  @Get('status')
  @UseGuards(AuthGuard)
  getStatus(@Req() req) {
    console.log(req);
    return { authenticated: true };
  }
}
