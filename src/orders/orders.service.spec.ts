import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { OrderMapper } from './mappers/order.mapper';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: {} },
        { provide: AccountsRepository, useValue: {} },
        { provide: UsersRepository, useValue: {} },
        OrderMapper,
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
