import { IsNotEmpty } from 'class-validator';

export class CreateOrderdetailDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  cartId: number;
}
