import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '@/accounts/entities/account.entity';
import { User } from '@/users/entities/user.entity';
import { Role } from '@/roles/entities/role.entity';
import { Employee } from '@/employees/entity/employee.entity';
import { Author } from '@/authors/entities/author.entity';
import { Publisher } from '@/publishers/entities/publisher.entity';
import { Category } from '@/categories/entities/category.entity';
import { Book } from '@/books/entities/book.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { Cartitem } from '@/cartitems/entities/cartitem.entity';
import { Order } from '@/orders/entities/order.entity';
import { Orderdetail } from '@/orderdetail/entities/orderdetail.entity';
import { Invoice } from '@/invoice/entities/invoice.entity';
import { InvoiceItem } from '@/invoiceitem/entities/invoiceitem.entity';
import { Review } from '@/reviews/entities/review.entity';

import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { RolesRepository } from '@/roles/repositories/roles.repository';
import { EmployeesRepository } from '@/employees/repositories/employees.repository';
import { AuthorsRepository } from '@/authors/repositories/authors.repository';
import { PublishersRepository } from '@/publishers/repositories/publishers.repository';
import { CategoriesRepository } from '@/categories/repositories/categories.repository';
import { BooksRepository } from '@/books/repositories/books.repository';
import { CartsRepository } from '@/carts/repositories/carts.repository';
import { CartItemsRepository } from '@/cartitems/repositories/cartitems.repository';
import { OrdersRepository } from '@/orders/repositories/orders.repository';
import { OrderDetailsRepository } from '@/orderdetail/repositories/orderdetail.repository';
import { InvoicesRepository } from '@/invoice/repositories/invoices.repository';
import { InvoiceItemsRepository } from '@/invoiceitem/repositories/invoiceitems.repository';
import { ReviewsRepository } from '@/reviews/repositories/reviews.repository';

const repositories = [
  AccountsRepository,
  UsersRepository,
  RolesRepository,
  EmployeesRepository,
  AuthorsRepository,
  PublishersRepository,
  CategoriesRepository,
  BooksRepository,
  CartsRepository,
  CartItemsRepository,
  OrdersRepository,
  OrderDetailsRepository,
  InvoicesRepository,
  InvoiceItemsRepository,
  ReviewsRepository,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      User,
      Role,
      Employee,
      Author,
      Publisher,
      Category,
      Book,
      Cart,
      Cartitem,
      Order,
      Orderdetail,
      Invoice,
      InvoiceItem,
      Review,
    ]),
  ],
  providers: [...repositories],
  exports: [...repositories],
})
export class RepositoriesModule {}
