import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderdetailDto } from './create-orderdetail.dto';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderdetailDto extends PartialType(CreateOrderdetailDto) {
  @IsNotEmpty()
  bookName: string;
  @IsOptional()
  @IsNumber()
  quantity: number;
}
