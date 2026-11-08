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
import { AppService } from './app.service';
import { ormConfig } from './config/ormconfig';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { RepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ormConfig,
    }),
    RepositoriesModule,
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
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
