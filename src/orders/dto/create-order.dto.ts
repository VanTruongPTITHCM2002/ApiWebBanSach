import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { parse } from 'date-fns';

export class CreateOrderDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @Transform(({ value }) => parse(value, 'HH:mm:ss dd/MM/yyyy', new Date()))
  orderDate: Date;
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;
  @IsNotEmpty()
  methodPay: string;
}
