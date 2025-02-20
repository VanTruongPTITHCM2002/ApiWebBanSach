import { Orderdetail } from 'src/orderdetail/entities/orderdetail.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @OneToMany(() => Orderdetail, (orderDetail) => orderDetail.orderId)
  orderdetails: Orderdetail[];

  @Column()
  orderDate: Date;

  @Column()
  totalAmount: number;

  @Column()
  status: number;
}
