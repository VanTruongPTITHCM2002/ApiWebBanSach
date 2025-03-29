/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { EmployeesModule } from './employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AccountsModule } from './accounts/accounts.module';
// import { Role } from './roles/entities/role.entity';
// import { Account } from './accounts/entities/account.entity';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
// import { Category } from './categories/entities/category.entity';
// import { Author } from './authors/entities/author.entity';
import { BooksModule } from './books/books.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { PublishersModule } from './publishers/publishers.module';
// import { Publisher } from './publishers/entities/publisher.entity';
// import { Book } from './books/entities/book.entity';
// import { User } from './users/entities/user.entity';

// import { Order } from './orders/entities/order.entity';
// import { Cart } from './carts/entities/cart.entity';
import { InvoiceModule } from './invoice/invoice.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CartitemsModule } from './cartitems/cartitems.module';
// import { Cartitem } from './cartitems/entities/cartitem.entity';
import { OrderdetailModule } from './orderdetail/orderdetail.module';
import { InvoiceitemModule } from './invoiceitem/invoiceitem.module';
// import { Orderdetail } from './orderdetail/entities/orderdetail.entity';
// import { Invoice } from './invoice/entities/invoice.entity';
// import { Invoiceitem } from './invoiceitem/entities/invoiceitem.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [ "dist/**/*.entity{.ts,.js}"],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    EmployeesModule,
    UsersModule,
    RolesModule,
    AccountsModule,
    AuthModule,
    AuthorsModule,
    CategoriesModule,
    BooksModule,
    CartsModule,
    OrdersModule,
    PublishersModule,
    InvoiceModule,
    ReviewsModule,
    CartitemsModule,
    OrderdetailModule,
    InvoiceitemModule,
    ConfigModule.forRoot(),
  ],

})
export class AppModule {}
