import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceItem } from '../entities/invoiceitem.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class InvoiceItemsRepository extends BaseRepository<InvoiceItem> {
  constructor(@InjectRepository(InvoiceItem) repo: Repository<InvoiceItem>) {
    super(repo, 'invoiceItem');
  }

  findByInvoice(invoiceId: string): Promise<InvoiceItem[]> {
    return this.repo.find({
      where: { invoice: { invoiceId } },
    });
  }
}
