import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { InvoiceMapper } from './mappers/invoice.mapper';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceMapper],
})
export class InvoiceModule {}
