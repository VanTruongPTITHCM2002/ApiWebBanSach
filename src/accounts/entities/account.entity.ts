import { Review } from 'src/reviews/entities/review.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @OneToOne(() => User, (user) => user.accountFK)
  user: User;

  @Column({ length: 45, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column()
  status: boolean;

  @ManyToOne(() => Role, (role) => role.accounts)
  @JoinColumn({ name: 'roleId' })
  roleId: Role;

  @OneToMany(() => Review, (review) => review.accountName)
  reviewlst: Review[];

  @CreateDateColumn()
  createdAt: Date;
}
