import { Test, TestingModule } from '@nestjs/testing';
import { OrderdetailController } from './orderdetail.controller';
import { OrderdetailService } from './orderdetail.service';

describe('OrderdetailController', () => {
  let controller: OrderdetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderdetailController],
      providers: [OrderdetailService],
    }).compile();

    controller = module.get<OrderdetailController>(OrderdetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
