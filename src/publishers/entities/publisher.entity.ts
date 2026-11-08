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

@Entity('publishers')
export class Publisher extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  publisherId: string;

  @Column({ length: 32, unique: true, nullable: true })
  publisherCode: string;

  @Column({ length: 100 })
  publisherName: string;

  @Column({ length: 255 })
  publisherAddress: string;

  @OneToMany(() => Book, (book) => book.publisher)
  books: Book[];

  @BeforeInsert()
  assignPublisherCode() {
    this.publisherCode ??= generateCode(CodePrefix.PUBLISHER);
  }
}
