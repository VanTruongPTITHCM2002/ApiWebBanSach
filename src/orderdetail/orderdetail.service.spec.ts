import { Test, TestingModule } from '@nestjs/testing';
import { OrderdetailService } from './orderdetail.service';
import { OrdersRepository } from '@/orders/repositories/orders.repository';
import { OrderDetailsRepository } from './repositories/orderdetail.repository';
import { BooksRepository } from '@/books/repositories/books.repository';
import { OrderdetailMapper } from './mappers/orderdetail.mapper';

describe('OrderdetailService', () => {
  let service: OrderdetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderdetailService,
        { provide: OrdersRepository, useValue: {} },
        { provide: OrderDetailsRepository, useValue: {} },
        { provide: BooksRepository, useValue: {} },
        OrderdetailMapper,
      ],
    }).compile();

    service = module.get<OrderdetailService>(OrderdetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
