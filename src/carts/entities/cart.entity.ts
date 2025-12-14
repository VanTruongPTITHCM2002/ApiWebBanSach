import { Cartitem } from '@/cartitems/entities/cartitem.entity';
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
export class Cart {
  @PrimaryGeneratedColumn()
  cartId: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'usersId' })
  usersId: User;

  @Column({ type: 'datetime' })
  createAt: Date;

  @OneToMany(() => Cartitem, (cartItem) => cartItem.carts)
  cartItemId: Cartitem[];

  @Column()
  status: boolean;
}
