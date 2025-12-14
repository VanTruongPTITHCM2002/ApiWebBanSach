import { CreateCartDto } from '@/carts/dto/create-cart.dto';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCartitemDto {
  @ValidateNested()
  @Type(() => CreateCartDto)
  cartDto: CreateCartDto;

  @IsString()
  @IsNotEmpty()
  bookName: string;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
