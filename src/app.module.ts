/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { EmployeesModule } from './employees/employees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AccountsModule } from './accounts/accounts.module';
import { Role } from './roles/entities/role.entity';
import { Account } from './accounts/entities/account.entity';
import { AuthModule } from './auth/auth.module';
import { AuthorsModule } from './authors/authors.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { Author } from './authors/entities/author.entity';
import { BooksModule } from './books/books.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { PublishersModule } from './publishers/publishers.module';
import { Publisher } from './publishers/entities/publisher.entity';
import { Book } from './books/entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'web_ban_sach',
      entities: [Role,Account,Category,Author,Publisher
        ,Book
      ],
      synchronize: true,
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
  ],
})
export class AppModule {}
