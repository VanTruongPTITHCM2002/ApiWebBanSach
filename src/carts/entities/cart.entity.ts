import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  cartId: number;

  @ManyToOne(() => User, (user) => user.usersId)
  @JoinColumn({ name: 'usersId' })
  usersId: User;

  @Column({ type: 'datetime' })
  createAt: Date;

  @Column()
  status: boolean;
}
