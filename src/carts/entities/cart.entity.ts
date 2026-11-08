import { Cartitem } from '@/cartitems/entities/cartitem.entity';
import { BaseEntity } from '@/common/base.entity';
import { CodePrefix, generateCode } from '@/common/helpers/code.helper';
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

@Entity('carts')
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  cartId: string;

  @Column({ length: 32, unique: true, nullable: true })
  cartCode: string;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'usersId' })
  usersId: User;

  @Column({ type: 'datetime' })
  createAt: Date;

  @OneToMany(() => Cartitem, (cartItem) => cartItem.carts)
  cartItemId: Cartitem[];

  @BeforeInsert()
  assignCartCode() {
    this.cartCode ??= generateCode(CodePrefix.CART);
  }
}
