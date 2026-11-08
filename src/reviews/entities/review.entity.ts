import { Account } from '@/accounts/entities/account.entity';
import { Book } from '@/books/entities/book.entity';
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

@Entity('reviews')
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  reviewId: string;

  @Column({ length: 32, unique: true, nullable: true })
  reviewCode: string;

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

  @BeforeInsert()
  assignReviewCode() {
    this.reviewCode ??= generateCode(CodePrefix.REVIEW);
  }
}
