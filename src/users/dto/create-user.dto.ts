import {
  IsAlphanumeric,
  IsEmail,
  IsEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Account } from 'src/accounts/entities/account.entity';

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
