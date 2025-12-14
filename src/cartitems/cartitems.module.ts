import { Module } from '@nestjs/common';
import { CartitemsService } from './cartitems.service';
import { CartitemsController } from './cartitems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cartitem } from './entities/cartitem.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { Book } from '@/books/entities/book.entity';
import { User } from '@/users/entities/user.entity';
import { Account } from '@/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cartitem, Cart, Account, User, Book])],
  controllers: [CartitemsController],
  providers: [CartitemsService],
})
export class CartitemsModule {}
