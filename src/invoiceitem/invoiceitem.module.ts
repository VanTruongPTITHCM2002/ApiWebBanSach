import { Module } from '@nestjs/common';
import { InvoiceitemService } from './invoiceitem.service';
import { InvoiceitemController } from './invoiceitem.controller';

@Module({
  controllers: [InvoiceitemController],
  providers: [InvoiceitemService],
})
export class InvoiceitemModule {}
