import { Book } from 'src/books/entities/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ length: 45 })
  categoryName: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
