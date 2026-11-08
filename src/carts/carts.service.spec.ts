import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
import { CartsRepository } from './repositories/carts.repository';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { CartMapper } from './mappers/cart.mapper';

describe('CartsService', () => {
  let service: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        { provide: CartsRepository, useValue: {} },
        { provide: AccountsRepository, useValue: {} },
        { provide: UsersRepository, useValue: {} },
        CartMapper,
      ],
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
