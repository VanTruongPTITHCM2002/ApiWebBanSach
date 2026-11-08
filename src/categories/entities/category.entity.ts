import { Book } from '@/books/entities/book.entity';
import { BaseEntity } from '@/common/base.entity';
import { CodePrefix, generateCode } from '@/common/helpers/code.helper';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({ length: 32, unique: true, nullable: true })
  categoryCode: string;

  @Column({ length: 45 })
  categoryName: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];

  @BeforeInsert()
  assignCategoryCode() {
    this.categoryCode ??= generateCode(CodePrefix.CATEGORY);
  }
}
