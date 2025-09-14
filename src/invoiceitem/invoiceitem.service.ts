import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Orderdetail } from 'src/orderdetail/entities/orderdetail.entity';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';
import { InvoiceItem } from './entities/invoiceitem.entity';
import { CreateInvoiceItemDto } from './dto/create-invoiceitem.dto';
import { UpdateInvoiceItemDto } from './dto/update-invoiceitem.dto';

@Injectable()
export class InvoiceitemService {
  constructor(
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Orderdetail)
    private readonly orderDetailRepository: Repository<Orderdetail>,
  ) {}
  async create(createInvoiceitemDto: CreateInvoiceItemDto) {
    try {
      // const order = await this.orderRepository.findOne({
      //   where: { orderId: createInvoiceitemDto.idOrder },
      //   relations: ['userId'],
      // });
      // if (!order) {
      //   throw new NotFoundException('Không tìm thấy đơn hàng này');
      // }
      // const orderDetail = await this.orderDetailRepository
      //   .createQueryBuilder('orderDetail')
      //   .leftJoinAndSelect('orderDetail.books', 'book')
      //   .where('orderDetail.orderId = :orderId', { orderId: order.orderId })
      //   .getMany();

      // const invoice = this.invoiceRepository.create({
      //   status: 0,
      //   paymentMethod: 'BANKING',
      //   invoiceDate: new Date(),
      //   userId: order.userId,
      //   invoiceItems: orderDetail.map((orderDetail) => ({
      //     quantity: orderDetail.quantity,
      //     price: orderDetail.price,
      //   })),
      // });

      // await this.invoiceRepository.save(invoice);

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.CREATED)
        .message('Tạo hóa đơn thành công')
        .build();
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message(error.message)
          .build();
      }
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message(error.message)
        .build();
    }
  }

  findAll() {
    try {
    } catch (error: any) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message(error.message)
        .build();
    }
    return `This action returns all invoiceitem`;
  }

  async findOne(id: number) {
    try {
      const invoice = await this.invoiceRepository.findOne({
        where: { invoiceId: id },
      });
      if (!invoice) {
        throw new NotFoundException('Không tìm thấy hóa đơn này');
      }
      const invoiceItems = await this.invoiceItemRepository.find({
        where: { invoice: { invoiceId: invoice.invoiceId } },
      });

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .data(invoiceItems)
        .build();
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message(error.message).build;
      }
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message(error.message)
        .build();
    }
  }

  update(id: number, updateInvoiceitemDto: UpdateInvoiceItemDto) {
    return `This action updates a #${id} invoiceitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} invoiceitem`;
  }
}
