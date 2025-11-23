import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user123', description: 'Tên đăng nhập' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  @MaxLength(40, { message: 'Tên đăng nhập tối đa 40 ký tự' })
  username: string;

  @ApiProperty({ example: 'mypassword', description: 'Mật khẩu' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(1, { message: 'Mật khẩu phải có ít nhất 1 ký tự' })
  password: string;

  @ApiPropertyOptional({ description: 'Remember me', example: true })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
