import { Invoice } from 'src/invoice/entities/invoice.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('invoiceitem')
export class Invoiceitem {
  @PrimaryGeneratedColumn()
  invoiceitemId: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;
}
