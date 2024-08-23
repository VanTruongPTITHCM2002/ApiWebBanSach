import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from 'src/response/apires';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.postLogin(username, password);
    return { accessToken };
  }

  @Post('signup')
  async singup(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('repassword') repasssword: string,
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
    @Body('email') email: string,
    @Body('address') address: string,
    @Body('phone') phone: string,
  ): Promise<ApiResponse<string>> {
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
