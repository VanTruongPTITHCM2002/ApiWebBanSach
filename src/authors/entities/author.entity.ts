import { Book } from '@/books/entities/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  authorId: number;

  @Column({ length: 45 })
  firstname: string;

  @Column({ length: 45 })
  lastname: string;

  @Column()
  country: string;

  @Column()
  quantity: number;

  @OneToMany(() => Book, (book) => book.authorId)
  books: Book[];
}
