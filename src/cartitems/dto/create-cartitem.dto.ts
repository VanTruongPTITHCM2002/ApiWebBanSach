import { IsEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCartitemDto {
  @IsNumber()
  @IsEmpty()
  cartId: number;
  @IsString()
  @IsEmpty()
  bookName: string;
  @IsEmpty()
  @IsNumber()
  quantity: number;
}
