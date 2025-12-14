import { Module } from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';
import { OrderdetailController } from './orderdetail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orderdetail } from './entities/orderdetail.entity';
import { Order } from '@/orders/entities/order.entity';
import { User } from '@/users/entities/user.entity';
import { Account } from '@/accounts/entities/account.entity';
import { Book } from '@/books/entities/book.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { Cartitem } from '@/cartitems/entities/cartitem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orderdetail,
      Order,
      User,
      Account,
      Book,
      Cart,
      Cartitem,
    ]),
  ],
  controllers: [OrderdetailController],
  providers: [OrderdetailService],
})
export class OrderdetailModule {}
