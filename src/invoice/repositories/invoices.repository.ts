import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Invoice,
  PaymentMethod,
  PaymentStatus,
} from '../entities/invoice.entity';
import { InvoiceItem } from '@/invoiceitem/entities/invoiceitem.entity';
import { BaseRepository } from '@/common/repositories/base.repository';
import { PageResult } from '@/common/interfaces/page-result.interface';

export interface InvoiceItemInput {
  bookId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalLine: number;
}

export interface CreateInvoiceWithItemsInput {
  invoiceCode?: string;
  userId: string;
  orderId: string;
  issueDate: Date;
  subtotal: number;
  vatPercent: number;
  vatAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  note?: string;
  items: InvoiceItemInput[];
}

@Injectable()
export class InvoicesRepository extends BaseRepository<Invoice> {
  constructor(@InjectRepository(Invoice) repo: Repository<Invoice>) {
    super(repo, 'invoice');
  }

  findByIdOrCode(id: string): Promise<Invoice | null> {
    return this.repo.findOne({
      where: [{ invoiceId: id }, { invoiceCode: id }],
    });
  }

  findByIdOrCodeWithDetails(id: string): Promise<Invoice | null> {
    return this.repo.findOne({
      where: [{ invoiceId: id }, { invoiceCode: id }],
      relations: [
        'userId',
        'order',
        'invoiceItems',
        'invoiceItems.book',
        'userId.accountFK',
      ],
    });
  }

  async findPage(page: number, size: number): Promise<PageResult<Invoice>> {
    const [content, totalElements] = await this.repo.findAndCount({
      skip: (page - 1) * size,
      take: size,
    });

    return this.toPage(content, totalElements, page, size);
  }

  createWithItems(input: CreateInvoiceWithItemsInput): Promise<Invoice> {
    return this.repo.manager.transaction(async (manager) => {
      const invoiceRepo = manager.getRepository(Invoice);
      const itemRepo = manager.getRepository(InvoiceItem);

      const invoice = await invoiceRepo.save(
        invoiceRepo.create({
          invoiceCode: input.invoiceCode,
          order: { orderId: input.orderId },
          userId: { usersId: input.userId },
          issueDate: input.issueDate,
          subtotal: input.subtotal,
          vatPercent: input.vatPercent,
          vatAmount: input.vatAmount,
          shippingFee: input.shippingFee,
          discountAmount: input.discountAmount,
          totalAmount: input.totalAmount,
          paymentStatus: input.paymentStatus,
          paymentMethod: input.paymentMethod,
          note: input.note,
        }),
      );

      await itemRepo.save(
        itemRepo.create(
          input.items.map((item) => ({
            invoice,
            book: { bookid: item.bookId },
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            totalLine: item.totalLine,
          })),
        ),
      );

      return invoice;
    });
  }

  updatePaymentStatus(id: string, status: PaymentStatus): Promise<void> {
    return this.updateById(id, { paymentStatus: status });
  }

  async sumActiveTotalAmount(): Promise<number> {
    const raw = await this.query()
      .select('COALESCE(SUM(invoice.totalAmount), 0)', 'total')
      .where('invoice.isActive = :isActive', { isActive: true })
      .getRawOne<{ total: string | number }>();

    return Number(raw?.total ?? 0);
  }
}
