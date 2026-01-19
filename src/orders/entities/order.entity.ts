import { BaseEntity } from '@/common/base.entity';
import { Invoice } from '@/invoice/entities/invoice.entity';
import { Orderdetail } from '@/orderdetail/entities/orderdetail.entity';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  orderId: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @OneToMany(() => Orderdetail, (orderDetail) => orderDetail.orderId)
  orderdetails: Orderdetail[];

  @OneToMany(() => Invoice, (invoice) => invoice.order)
  invoices: Invoice;

  @Column()
  orderDate: Date;

  @Column()
  totalAmount: number;

  @Column()
  methodPay: string; //COD, BANKING

  @Column()
  workflowStatus: number; // 0: Pending, 1: Completed, 2: Processing, 3: Shipping, -1: Cancel, 4: Refund
}
