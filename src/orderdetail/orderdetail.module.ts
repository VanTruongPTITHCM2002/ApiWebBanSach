import { Module } from '@nestjs/common';
import { OrderdetailService } from './orderdetail.service';
import { OrderdetailController } from './orderdetail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orderdetail } from './entities/orderdetail.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Book } from 'src/books/entities/book.entity';
import { Cartitem } from 'src/cartitems/entities/cartitem.entity';
import { Cart } from 'src/carts/entities/cart.entity';

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
