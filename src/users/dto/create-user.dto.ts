import { Account } from '@/accounts/entities/account.entity';
import {
  IsAlphanumeric,
  IsEmail,
  IsEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmpty()
  @Length(1, 100)
  firstname: string;

  @IsString()
  @IsEmpty()
  @Length(1, 100)
  lastname: string;

  @IsEmpty()
  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsEmpty()
  @Length(1, 255)
  address: string;

  @IsAlphanumeric()
  @IsEmpty()
  @Length(1, 11)
  phone: string;

  @IsEmpty()
  accountId: Account;
}
