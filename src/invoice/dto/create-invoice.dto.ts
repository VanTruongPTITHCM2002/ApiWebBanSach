import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/invoice.entity';
import { Type } from 'class-transformer';
import { CreateInvoiceItemDto } from '@/invoiceitem/dto/create-invoiceitem.dto';

export class CreateInvoiceDto {
  @IsUUID('4')
  orderId: string;

  @IsUUID('4')
  userId: string;

  @IsOptional()
  @IsString()
  invoiceCode?: string; // có thể auto generate

  @IsOptional()
  issueDate?: Date;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsOptional()
  @IsNumber()
  vatPercent?: number;

  @IsOptional()
  @IsNumber()
  vatAmount?: number;

  @IsOptional()
  @IsNumber()
  shippingFee?: number;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  note?: string;

  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}
