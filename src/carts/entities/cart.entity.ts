import { Cartitem } from '@/cartitems/entities/cartitem.entity';
import { BaseEntity } from '@/common/base.entity';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('carts')
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  cartId: string;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'usersId' })
  usersId: User;

  @Column({ type: 'datetime' })
  createAt: Date;

  @OneToMany(() => Cartitem, (cartItem) => cartItem.carts)
  cartItemId: Cartitem[];
}
