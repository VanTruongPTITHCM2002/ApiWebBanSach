import { Test, TestingModule } from '@nestjs/testing';
import { OrderdetailService } from './orderdetail.service';

describe('OrderdetailService', () => {
  let service: OrderdetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderdetailService],
    }).compile();

    service = module.get<OrderdetailService>(OrderdetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
