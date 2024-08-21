import { Author } from 'src/authors/entities/author.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  bookid: number;

  @Column({ length: 45 })
  title: string;

  @ManyToOne(() => Author, (author) => author.authorId)
  authorId: Author;

  @ManyToOne(() => Publisher, (publisher) => publisher.publisherId)
  publisherId: Publisher;

  @ManyToOne(() => Category, (category) => category.categoryId)
  categoryId: Category;

  price: number;

  stock: number;
}
