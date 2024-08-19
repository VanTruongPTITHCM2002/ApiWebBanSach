import { Account } from 'src/accounts/entities/account.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column({ length: 45 })
  roleName: string;

  @OneToMany(() => Account, (account) => account.roleId)
  accounts: Account[];
}
