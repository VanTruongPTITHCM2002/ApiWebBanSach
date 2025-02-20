import { Invoiceitem } from 'src/invoiceitem/entities/invoiceitem.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  invoiceId: number;

  @ManyToOne(() => User, (user) => user.usersId)
  @JoinColumn({ name: 'userId' })
  userId: User;

  @OneToMany(() => Invoiceitem, (invoiceItem) => invoiceItem.invoiceId)
  invoiceItems: Invoiceitem[];

  @Column()
  invoiceDate: Date;

  @Column()
  paymentMethod: string;

  @Column()
  status: number;
}
