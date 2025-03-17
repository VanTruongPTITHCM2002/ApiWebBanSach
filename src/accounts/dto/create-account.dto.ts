// src/accounts/create-account.dto.ts
import {
  IsString,
  Length,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString({ message: 'Tên đăng nhập phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @Length(3, 45)
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  @MaxLength(45, { message: 'Tên đăng nhập không được quá 45 ký tự' })
  username: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @Length(8, 30)
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @MaxLength(30, { message: 'Mật khẩu không được quá 30 ký tự' })
  password: string;
}
