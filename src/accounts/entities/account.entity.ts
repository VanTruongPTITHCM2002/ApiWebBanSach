import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

  @OneToOne(() => User, (user) => user.accountId)
  user: User;

  @Column({ length: 45 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @ManyToOne(() => Role, (role) => role.accounts)
  @JoinColumn({ name: 'roleId' })
  roleId: Role;

  @CreateDateColumn()
  createdAt: Date;
}
