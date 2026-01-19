import { Account } from '@/accounts/entities/account.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { BaseEntity } from '@/common/base.entity';
import { Order } from '@/orders/entities/order.entity';
import { Length } from 'class-validator';

import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  usersId: string;

  @Column({ length: 100 })
  @Length(1, 100)
  firstname: string;

  @Column({ length: 100 })
  @Length(1, 100)
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 12 })
  @Length(1, 11)
  phone: string;

  @OneToOne(() => Account, (account) => account.user, { cascade: true })
  @JoinColumn({ name: 'accountId' })
  accountFK: Account;

  @OneToMany(() => Order, (order) => order.userId)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.usersId)
  carts: Cart[];
}
