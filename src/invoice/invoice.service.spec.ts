import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { InvoicesRepository } from './repositories/invoices.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { OrdersRepository } from '@/orders/repositories/orders.repository';
import { InvoiceMapper } from './mappers/invoice.mapper';

describe('InvoiceService', () => {
  let service: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        { provide: InvoicesRepository, useValue: {} },
        { provide: UsersRepository, useValue: {} },
        { provide: OrdersRepository, useValue: {} },
        InvoiceMapper,
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
