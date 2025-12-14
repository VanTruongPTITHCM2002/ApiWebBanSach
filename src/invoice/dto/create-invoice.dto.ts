import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/invoice.entity';
import { Type } from 'class-transformer';
import { CreateInvoiceItemDto } from '@/invoiceitem/dto/create-invoiceitem.dto';

export class CreateInvoiceDto {
  @IsInt()
  orderId: number;

  @IsInt()
  userId: number;

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
