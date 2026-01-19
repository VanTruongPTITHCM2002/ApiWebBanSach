import { Account } from '@/accounts/entities/account.entity';
import { Book } from '@/books/entities/book.entity';
import { BaseEntity } from '@/common/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  reviewId: string;

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
