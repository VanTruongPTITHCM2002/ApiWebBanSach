import { Author } from '@/authors/entities/author.entity';
import { Category } from '@/categories/entities/category.entity';
import { BaseEntity } from '@/common/base.entity';
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
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  bookid: string;

  @Column({ length: 100 })
  title: string;

  @Column()
  isDeleted: boolean;

  @ManyToOne(() => Author, (author) => author.id)
  @JoinColumn({ name: 'authorId' })
  authorId: Author;

  @ManyToOne(() => Publisher, (publisher) => publisher.publisherId)
  @JoinColumn({ name: 'publisherId' })
  publisher: Publisher;

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

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: 'json', nullable: true })
  images: string[];
}
