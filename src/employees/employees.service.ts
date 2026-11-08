import { Injectable } from '@nestjs/common';
import { Employee } from './entity/employee.entity';
import { EmployeesRepository } from './repositories/employees.repository';

@Injectable()
export class EmployeesService {
  constructor(private readonly employeeRepository: EmployeesRepository) {}

  findAll(): Promise<Employee[]> {
    return this.employeeRepository.findMany();
  }

  findOne(id: string): Promise<Employee> {
    return this.employeeRepository.findByIdOrCode(id);
  }

  create(employee: Employee): Promise<Employee> {
    return this.employeeRepository.create(employee);
  }

  async update(id: string, employee: Employee): Promise<void> {
    await this.employeeRepository.updateById(id, employee);
  }

  async remove(id: string): Promise<void> {
    await this.employeeRepository.deleteById(id);
  }
}
