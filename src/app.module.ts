import { Module } from '@nestjs/common';

import { EmployeesModule } from './employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { BooksModule } from './books/books.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { PublishersModule } from './publishers/publishers.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CartitemsModule } from './cartitems/cartitems.module';
import { OrderdetailModule } from './orderdetail/orderdetail.module';
import { InvoiceitemModule } from './invoiceitem/invoiceitem.module';
import { Role } from './roles/entities/role.entity';
import { Account } from './accounts/entities/account.entity';
import { AppService } from './app.service';
import { ormConfig } from './config/ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfig,
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
    TypeOrmModule.forFeature([Role, Account]),
  ],
  providers: [AppService],
})
export class AppModule {}
