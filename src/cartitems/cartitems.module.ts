import { Module } from '@nestjs/common';
import { CartitemsService } from './cartitems.service';
import { CartitemsController } from './cartitems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cartitem } from './entities/cartitem.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cartitem, Cart, Account, User, Book])],
  controllers: [CartitemsController],
  providers: [CartitemsService],
})
export class CartitemsModule {}
