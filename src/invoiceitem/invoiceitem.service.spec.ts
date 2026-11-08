import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceitemService } from './invoiceitem.service';
import { InvoiceItemsRepository } from './repositories/invoiceitems.repository';
import { InvoicesRepository } from '@/invoice/repositories/invoices.repository';

describe('InvoiceitemService', () => {
  let service: InvoiceitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceitemService,
        { provide: InvoiceItemsRepository, useValue: {} },
        { provide: InvoicesRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<InvoiceitemService>(InvoiceitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
