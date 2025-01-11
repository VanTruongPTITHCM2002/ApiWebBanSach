import { PartialType } from '@nestjs/mapped-types';
import { CreateCartitemDto } from './create-cartitem.dto';

export class UpdateCartitemDto extends PartialType(CreateCartitemDto) {}
