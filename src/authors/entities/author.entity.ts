import { Book } from '@/books/entities/book.entity';
import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('authors')
export class Author extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
