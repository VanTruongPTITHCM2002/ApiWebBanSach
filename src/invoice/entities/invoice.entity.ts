import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  invoiceId: number;

  @ManyToOne(() => User, (user) => user.usersId)
  @JoinColumn()
  userId: User;

  @Column()
  invoiceDate: Date;

  @Column()
  paymentMethod: string;

  @Column()
  status: number;
}
