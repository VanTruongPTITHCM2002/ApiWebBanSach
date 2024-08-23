import { Length } from 'class-validator';
import { Account } from 'src/accounts/entities/account.entity';
import {
  Column,
  Entity,
  IsNull,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  usersId: number;

  @Column({ length: 100 })
  @Length(1, 100)
  firstname: string;

  @Column({ length: 100 })
  @Length(1, 100)
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 255 })
  address: string;

  @Column({ length: 12 })
  @Length(1, 11)
  phone: string;

  @OneToOne(() => Account, (account) => account.accountId, { cascade: true })
  @JoinColumn({ name: 'accountId' })
  accountId: Account;
}
