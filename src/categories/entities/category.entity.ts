import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ length: 45 })
  categoryName: string;
}
