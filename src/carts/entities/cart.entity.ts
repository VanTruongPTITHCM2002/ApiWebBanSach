import { Cartitem } from 'src/cartitems/entities/cartitem.entity';
import { User } from 'src/users/entities/user.entity';
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

  @OneToMany(() => Cartitem, (cartItem) => cartItem.cartId)
  cartItemId: Cartitem[];

  @Column()
  status: boolean;
}
