/* eslint-disable prettier/prettier */
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    orderId: number;

    @ManyToOne(()=>User,(user)=>user.usersId)
    userId: User;

    @Column()
    orderDate: Date;

    @Column()
    totalAmount: number;

    @Column()
    status:number

}
