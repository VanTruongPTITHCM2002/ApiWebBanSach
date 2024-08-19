import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  authorId: number;

  @Column({ length: 45 })
  firstname: string;

  @Column({ length: 45 })
  lastname: string;
}
