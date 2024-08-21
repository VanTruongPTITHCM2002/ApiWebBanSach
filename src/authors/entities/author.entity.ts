import { Book } from 'src/books/entities/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  authorId: number;

  @Column({ length: 45 })
  firstname: string;

  @Column({ length: 45 })
  lastname: string;

  @OneToMany(() => Book, (book) => book.authorId)
  books: Book[];
}
