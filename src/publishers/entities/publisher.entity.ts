import { Book } from 'src/books/entities/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publishers')
export class Publisher {
  @PrimaryGeneratedColumn()
  publisherId: number;

  @Column({ length: 100 })
  publisherName: string;

  @Column({ length: 255 })
  publisherAddress: string;

  @OneToMany(() => Book, (book) => book.publisherId)
  books: Book[];
}
