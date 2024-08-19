import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  accountId: number;

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
