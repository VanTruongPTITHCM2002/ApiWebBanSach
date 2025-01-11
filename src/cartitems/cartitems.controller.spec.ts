import { Test, TestingModule } from '@nestjs/testing';
import { CartitemsController } from './cartitems.controller';
import { CartitemsService } from './cartitems.service';

describe('CartitemsController', () => {
  let controller: CartitemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartitemsController],
      providers: [CartitemsService],
    }).compile();

    controller = module.get<CartitemsController>(CartitemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
