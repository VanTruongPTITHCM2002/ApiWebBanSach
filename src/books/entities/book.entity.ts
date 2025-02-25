import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Orderdetail } from 'src/orderdetail/entities/orderdetail.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
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

  @ManyToOne(() => Author, (author) => author.authorId)
  @JoinColumn({ name: 'authorId' })
  authorId: Author;

  @ManyToOne(() => Publisher, (publisher) => publisher.publisherId)
  @JoinColumn({ name: 'publisherId' })
  publisherId: Publisher;

  @ManyToOne(() => Category, (category) => category.categoryId)
  @JoinColumn({ name: 'categoryId' })
  categoryId: Category;

  @OneToMany(() => Orderdetail, (orderDetail) => orderDetail.books)
  orderdetails: Orderdetail[];

  @Column()
  price: number;

  @Column()
  stock: number;
}
