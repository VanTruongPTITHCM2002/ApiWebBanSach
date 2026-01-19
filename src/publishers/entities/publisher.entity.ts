import { Book } from '@/books/entities/book.entity';
import { BaseEntity } from '@/common/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publishers')
export class Publisher extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  publisherId: string;

  @Column({ length: 100 })
  publisherName: string;

  @Column({ length: 255 })
  publisherAddress: string;

  @OneToMany(() => Book, (book) => book.publisher)
  books: Book[];
}
