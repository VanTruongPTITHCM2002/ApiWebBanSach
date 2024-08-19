/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entity/employee.entity';
@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,
    ) { }

    findAll(): Promise<Employee[]> {
        return this.employeeRepository.find();
    }

    findOne(id: number): Promise<Employee> {
        return this.employeeRepository.findOneBy({ id });
    }

    create(employee: Employee): Promise<Employee> {
        return this.employeeRepository.save(employee);
    }

    async update(id: number, employee: Employee): Promise<void> {
        await this.employeeRepository.update(id, employee);
    }

    async remove(id: number): Promise<void> {
        await this.employeeRepository.delete(id);
    }
}
