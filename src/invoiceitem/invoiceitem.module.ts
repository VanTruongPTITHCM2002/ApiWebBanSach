import { Module } from '@nestjs/common';
import { InvoiceitemService } from './invoiceitem.service';
import { InvoiceitemController } from './invoiceitem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceItem } from './entities/invoiceitem.entity';
import { Invoice } from '@/invoice/entities/invoice.entity';
import { Order } from '@/orders/entities/order.entity';
import { Orderdetail } from '@/orderdetail/entities/orderdetail.entity';
import { User } from '@/users/entities/user.entity';
import { Account } from '@/accounts/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      InvoiceItem,
      Order,
      Orderdetail,
      User,
      Account,
    ]),
  ],
  controllers: [InvoiceitemController],
  providers: [InvoiceitemService],
})
export class InvoiceitemModule {}
