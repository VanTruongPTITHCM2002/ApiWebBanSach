import { BaseEntity } from '@/common/base.entity';
import { CodePrefix, generateCode } from '@/common/helpers/code.helper';
import { InvoiceItem } from '@/invoiceitem/entities/invoiceitem.entity';
import { Order } from '@/orders/entities/order.entity';
import { User } from '@/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PaymentStatus {
  UNPAID = 'Chưa thanh toán',
  PAID = 'Đã thanh toán',
  REFUNDED = 'Hoàn tiền',
}

export enum PaymentMethod {
  COD = 'Tiền mặt',
  BANK = 'Ngân hàng',
}

@Entity()
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  invoiceId: string;

  @Column({ length: 32, unique: true, nullable: true })
  invoiceCode: string;

  @ManyToOne(() => User, (user) => user.usersId)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice, {
    cascade: true,
  })
  invoiceItems: InvoiceItem[];

  @ManyToOne(() => Order, (order) => order.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  issueDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  vatPercent: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  vatAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  shippingFee: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.COD })
  paymentMethod: PaymentMethod;

  @Column({ type: 'text', nullable: true })
  note?: string;

  @BeforeInsert()
  assignInvoiceCode() {
    this.invoiceCode ??= generateCode(CodePrefix.INVOICE);
  }
}
