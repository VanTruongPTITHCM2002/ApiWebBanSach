import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateCartDto } from 'src/carts/dto/create-cart.dto';

export class CreateCartitemDto {
  @IsNotEmpty()
  @ValidateNested() // Đảm bảo DTO lồng nhau được validate
  @Type(() => CreateCartDto) // Cần có @Type() để transform đúng
  cartDto: CreateCartDto;

  @IsString()
  @IsNotEmpty()
  bookName: string;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
