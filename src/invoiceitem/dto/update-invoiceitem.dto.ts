import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoiceItemDto } from './create-invoiceitem.dto';

export class UpdateInvoiceItemDto extends PartialType(CreateInvoiceItemDto) {}
