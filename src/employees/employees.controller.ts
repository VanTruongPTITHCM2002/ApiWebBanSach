/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { Employee } from './entity/employee.entity';

@Controller('employees')
export class EmployeesController {

    constructor(private readonly employeeService:EmployeesService) 
    {}

    @Get()
    findAll(): Promise<Employee[]>{
        return this.employeeService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string): Promise<Employee>{
        return this.employeeService.findOne(+id);
    }

    @Post()
    create(@Body() employee: Employee):Promise<Employee>{
        return this.employeeService.create(employee);
    }

    @Put()
    update(@Param('id') id: string, @Body() employee:Employee): Promise<void>{
            return this.employeeService.update(+id,employee);
    }

    @Delete(':id')
    remove(@Param('id') id:string): Promise<void>{
        return this.employeeService.remove(+id);
    }
}
