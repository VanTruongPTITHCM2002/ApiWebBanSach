import { Account } from 'src/accounts/entities/account.entity';
import { Book } from 'src/books/entities/book.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  reviewId: number;

  @ManyToOne(() => Account, (account) => account.reviewlst)
  @JoinColumn({ name: 'userId' })
  accountName: Account;

  @ManyToOne(() => Book, (book) => book.reviewBook)
  @JoinColumn({ name: 'bookId' })
  books: Book;

  @Column()
  rating: number;

  @Column()
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reviewDate: Date;
}
