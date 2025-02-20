import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceitemController } from './invoiceitem.controller';
import { InvoiceitemService } from './invoiceitem.service';

describe('InvoiceitemController', () => {
  let controller: InvoiceitemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceitemController],
      providers: [InvoiceitemService],
    }).compile();

    controller = module.get<InvoiceitemController>(InvoiceitemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
