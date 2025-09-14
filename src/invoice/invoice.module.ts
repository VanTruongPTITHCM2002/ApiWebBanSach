import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice } from './entities/invoice.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { InvoiceItem } from 'src/invoiceitem/entities/invoiceitem.entity';
import { Order } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Invoice, InvoiceItem, Order])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
