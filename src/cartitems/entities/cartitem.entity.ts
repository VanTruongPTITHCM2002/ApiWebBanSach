import { Book } from '@/books/entities/book.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { BaseEntity } from '@/common/base.entity';
import { CodePrefix, generateCode } from '@/common/helpers/code.helper';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cartitems')
export class Cartitem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  cartitemId: string;

  @Column({ length: 32, unique: true, nullable: true })
  cartItemCode: string;

  @ManyToOne(() => Cart, (cart) => cart.cartItemId)
  @JoinColumn({ name: 'cartId' })
  carts: Cart;

  @ManyToOne(() => Book, (book) => book.bookid)
  @JoinColumn({ name: 'bookId' })
  bookId: Book;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @BeforeInsert()
  assignCartItemCode() {
    this.cartItemCode ??= generateCode(CodePrefix.CART_ITEM);
  }
}
