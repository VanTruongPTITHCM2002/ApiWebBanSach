import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceitemDto } from './create-invoiceitem.dto';

export class UpdateInvoiceitemDto extends PartialType(CreateInvoiceitemDto) {}
