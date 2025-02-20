import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceitemService } from './invoiceitem.service';

describe('InvoiceitemService', () => {
  let service: InvoiceitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoiceitemService],
    }).compile();

    service = module.get<InvoiceitemService>(InvoiceitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
