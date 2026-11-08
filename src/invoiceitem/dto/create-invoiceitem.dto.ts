import { IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateInvoiceItemDto {
  @IsUUID('4')
  bookId: string;

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
