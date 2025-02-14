import { Book } from 'src/books/entities/book.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('cartitems')
export class Cartitem {
  @PrimaryColumn()
  cartitemId: number;

  @ManyToOne(() => Cart, (cart) => cart.cartId)
  cartId: Cart;

  @ManyToOne(() => Book, (book) => book.bookid)
  bookId: Book;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
