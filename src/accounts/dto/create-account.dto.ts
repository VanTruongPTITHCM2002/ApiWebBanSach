// src/accounts/create-account.dto.ts
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 45)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255) // Độ dài mật khẩu có thể thay đổi tùy theo yêu cầu bảo mật
  password: string;
}
