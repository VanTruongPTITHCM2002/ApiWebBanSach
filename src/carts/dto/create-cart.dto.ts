import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { parse } from 'date-fns';

export class CreateCartDto {
  @IsNotEmpty()
  username: string;

  @Transform(({ value }) => parse(value, 'HH:mm:ss dd/MM/yyyy', new Date()))
  createAt?: Date;
}
