/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('employee')
export class Employee {
    @PrimaryGeneratedColumn()
    idemployee:number;

    @Column()
    name:string;

    @Column()
    position:string;

    @Column()
    salary:number;
}