import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsInt()
  bookId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsNumber()
  totalLine: number;
}
