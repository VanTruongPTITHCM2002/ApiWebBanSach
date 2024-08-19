import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('publishers')
export class Publisher {
  @PrimaryGeneratedColumn()
  publisherId: number;

  @Column({ length: 100 })
  publisherName: string;

  @Column({ length: 255 })
  publisherAddress: string;
}
