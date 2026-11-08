import { Test, TestingModule } from '@nestjs/testing';
import { CartitemsService } from './cartitems.service';
import { CartsRepository } from '@/carts/repositories/carts.repository';
import { CartItemsRepository } from './repositories/cartitems.repository';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { BooksRepository } from '@/books/repositories/books.repository';

describe('CartitemsService', () => {
  let service: CartitemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartitemsService,
        { provide: CartsRepository, useValue: {} },
        { provide: CartItemsRepository, useValue: {} },
        { provide: AccountsRepository, useValue: {} },
        { provide: UsersRepository, useValue: {} },
        { provide: BooksRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<CartitemsService>(CartitemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
