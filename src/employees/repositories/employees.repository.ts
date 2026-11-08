import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entity/employee.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class EmployeesRepository extends BaseRepository<Employee> {
  constructor(@InjectRepository(Employee) repo: Repository<Employee>) {
    super(repo, 'employee');
  }

  findByIdOrCode(idOrCode: string): Promise<Employee | null> {
    return this.repo.findOne({
      where: [{ idemployee: idOrCode }, { employeeCode: idOrCode }],
    });
  }
}
