import { Author } from '@/authors/entities/author.entity';
import { Category } from '@/categories/entities/category.entity';
import { InvoiceItem } from '@/invoiceitem/entities/invoiceitem.entity';
import { Orderdetail } from '@/orderdetail/entities/orderdetail.entity';
import { Publisher } from '@/publishers/entities/publisher.entity';
import { Review } from '@/reviews/entities/review.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  bookid: number;

  @Column({ length: 45 })
  title: string;

  @Column()
  isDeleted: boolean;

  @ManyToOne(() => Author, (author) => author.authorId)
  @JoinColumn({ name: 'authorId' })
  authorId: Author;

  @ManyToOne(() => Publisher, (publisher) => publisher.publisherId)
  @JoinColumn({ name: 'publisherId' })
  publisherId: Publisher;

  @ManyToOne(() => Category, (category) => category.books)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Orderdetail, (orderDetail) => orderDetail.books)
  orderdetails: Orderdetail[];

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.book)
  invoiceItems: InvoiceItem[];

  @OneToMany(() => Review, (review) => review.books)
  reviewBook: Review[];

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column()
  status: boolean;

  @Column({ type: 'mediumblob', nullable: true })
  image: Buffer;

  @Column({ default: '' })
  link: string;
}
