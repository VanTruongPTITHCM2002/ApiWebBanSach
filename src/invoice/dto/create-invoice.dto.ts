import { IsDateString, IsEmpty, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsEmpty()
  username: string;

  @IsEmpty()
  @IsDateString()
  invoiceDate: string;

  @IsEmpty()
  @IsString()
  paymentMethod: string;
}
