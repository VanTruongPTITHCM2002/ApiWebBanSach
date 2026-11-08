import { Account } from '@/accounts/entities/account.entity';
import { BaseEntity } from '@/common/base.entity';
import { CodePrefix, generateCode } from '@/common/helpers/code.helper';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  roleId: string;

  @Column({ length: 32, unique: true, nullable: true })
  roleCode: string;

  @Column({ length: 45, unique: true })
  roleName: string;

  @OneToMany(() => Account, (account) => account.roleId)
  accounts: Account[];

  @BeforeInsert()
  assignRoleCode() {
    this.roleCode ??= generateCode(CodePrefix.ROLE);
  }
}
