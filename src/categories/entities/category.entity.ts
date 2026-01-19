import { Book } from '@/books/entities/book.entity';
import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ length: 45 })
  categoryName: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
