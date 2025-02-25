import { IsNotEmpty } from 'class-validator';

export class CreateInvoiceitemDto {
  @IsNotEmpty()
  idOrder: number;
}
