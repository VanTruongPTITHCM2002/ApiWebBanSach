import { Book } from '@/books/entities/book.entity';
import { Invoice } from '@/invoice/entities/invoice.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('invoiceitem')
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  invoiceitemId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalLine: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @ManyToOne(() => Book, (book) => book.invoiceItems)
  @JoinColumn({ name: 'bookId' })
  book: Book;
}
