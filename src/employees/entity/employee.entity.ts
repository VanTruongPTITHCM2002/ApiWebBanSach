import { BaseEntity } from '@/common/base.entity';
import { CodePrefix, generateCode } from '@/common/helpers/code.helper';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('employee')
export class Employee extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idemployee: string;

  @Column({ length: 32, unique: true, nullable: true })
  employeeCode: string;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column()
  salary: number;

  @BeforeInsert()
  assignEmployeeCode() {
    this.employeeCode ??= generateCode(CodePrefix.EMPLOYEE);
  }
}
