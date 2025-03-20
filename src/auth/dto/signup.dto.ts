import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'user123', description: 'Tên đăng nhập' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  @MaxLength(40, { message: 'Tên đăng nhập tối đa 40 ký tự' })
  username: string;
  @ApiProperty({ example: 'mypassword', description: 'Mật khẩu' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;
  @ApiProperty({ example: 'mypassword', description: 'Mật khẩu' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  repassword: string;
  @ApiProperty({ example: 'John', description: 'Họ' })
  @IsString({ message: 'Họ phải là chuỗi' })
  @IsNotEmpty({ message: 'Họ không được để trống' })
  @MinLength(1, { message: 'Họ phải có ít nhất 1 ký tự' })
  firstname: string;
  @ApiProperty({ example: 'Doe', description: 'Tên' })
  @IsString({ message: 'Tên phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @MinLength(1, { message: 'Tên phải có ít nhất 1 ký tự' })
  lastname: string;
  @ApiProperty({ example: 'adsd@gmail.com', description: 'Email' })
  @IsString({ message: 'Email phải là chuỗi' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @MinLength(1, { message: 'Email phải có ít nhất 1 ký tự' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
  @ApiProperty({ example: '123 Street', description: 'Địa chỉ' })
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @MinLength(1, { message: 'Địa chỉ phải có ít nhất 1 ký tự' })
  address: string;
  @ApiProperty({ example: '0123456789', description: 'Số điện thoại' })
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @MinLength(10, { message: 'Số điện thoại phải có ít nhất 10 số' })
  phone: string;
}
