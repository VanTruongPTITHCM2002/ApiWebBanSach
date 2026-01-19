import { Book } from '@/books/entities/book.entity';
import { BaseEntity } from '@/common/base.entity';
import { Order } from '@/orders/entities/order.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity('orderdetails')
export class Orderdetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  orderdetailId: string;

  @ManyToOne(() => Order, (order) => order.orderdetails)
  @JoinColumn({ name: 'orderId' })
  orderId: Order;

  @ManyToOne(() => Book, (book) => book.orderdetails)
  @JoinColumn({ name: 'bookId' })
  books: Book;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
