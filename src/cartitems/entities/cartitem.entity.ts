import { Book } from '@/books/entities/book.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { BaseEntity } from '@/common/base.entity';
import {
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
}
