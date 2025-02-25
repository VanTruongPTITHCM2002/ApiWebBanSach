import { Module } from '@nestjs/common';
import { InvoiceitemService } from './invoiceitem.service';
import { InvoiceitemController } from './invoiceitem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Invoiceitem } from './entities/invoiceitem.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Orderdetail } from 'src/orderdetail/entities/orderdetail.entity';
import { User } from 'src/users/entities/user.entity';
import { Account } from 'src/accounts/entities/account.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      Invoiceitem,
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
