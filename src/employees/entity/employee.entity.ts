/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    position:string;

    @Column()
    salary:number;
}