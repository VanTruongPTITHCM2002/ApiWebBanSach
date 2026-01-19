import { BaseEntity } from '@/common/base.entity';
import { Review } from '@/reviews/entities/review.entity';
import { Role } from '@/roles/entities/role.entity';
import { User } from '@/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('accounts')
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  accountId: number;

  @OneToOne(() => User, (user) => user.accountFK)
  user: User;

  @Column({ length: 45, unique: true })
  username: string;

  @Column({ length: 255 })
  password: string;

  @ManyToOne(() => Role, (role) => role.accounts)
  @JoinColumn({ name: 'roleId' })
  roleId: Role;

  @OneToMany(() => Review, (review) => review.accountName)
  reviewlst: Review[];
}
