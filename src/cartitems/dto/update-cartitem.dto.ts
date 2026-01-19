import { PartialType } from '@nestjs/mapped-types';
import { CreateCartitemDto } from './create-cartitem.dto';
import { IsOptional } from 'class-validator';

export class UpdateCartitemDto extends PartialType(CreateCartitemDto) {
  @IsOptional()
  cartItemId: string;
}
