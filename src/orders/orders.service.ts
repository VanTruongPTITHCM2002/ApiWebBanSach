import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: createOrderDto.username },
      });

      if (!account) {
        throw new NotFoundException('Không tìm thấy tài khoản này');
      }

      const user = await this.userRepository.findOne({
        where: { accountFK: { accountId: account.accountId } },
      });

      if (!user) {
        throw new NotFoundException(
          'Không tìm thấy người dùng tương ứng tài khoản',
        );
      }

      const order = await this.orderRepository.create({
        userId: user,
        orderDate: createOrderDto.orderDate,
        status: 1,
        totalAmount: 0,
      });

      await this.orderRepository.save(order);

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.CREATED)
        .message('Tạo đơn hàng thành công')
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

  async findAll() {
    try {
      const orders = await this.orderRepository.find();
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Lấy thành công danh sách đơn hàng')
        .data(orders)
        .build();
    } catch (error: unknown) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Có lỗi đã xảy ra..')
        .build();
    }
  }

  async findOne(id?: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderId: id },
      });

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng có mã trên');
      }

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Tìm thấy thành công đơn hàng có mã ' + id)
        .data(order)
        .build();
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.OK)
          .message(error.message)
          .build();
      }

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Đã có lỗi xảy ra...')
        .build();
    }
  }

  async findByDate(orderDate: string) {
    try {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
      if (!dateRegex.test(orderDate)) {
        throw new BadRequestException('Định dạng ngày tháng không hợp lệ');
      }

      const [day, month, year] = orderDate.split('-').map(Number);
      const parseDate = new Date(Date.UTC(year, month - 1, day));
      const formatDate = parseDate.toISOString().split('T')[0];

      const orders = await this.orderRepository
        .createQueryBuilder('Order')
        .where('DATE(Order.orderDate) = :date', { date: formatDate })
        .getMany();

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Lấy thành công danh sách đơn hàng có ngày ' + orderDate)
        .data(orders)
        .build();
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.BAD_REQUEST)
          .message(error.message)
          .build();
      }
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Đã có lỗi xảy ra...')
        .build();
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderId: id },
      });

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng có mã này');
      }

      order.status = updateOrderDto.status;
      await this.orderRepository.save(order);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Cập nhật thành công trạng thái đơn hàng')
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
        .message('Đã có lỗi xảy ra...')
        .build();
    }
  }

  async remove(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderId: id },
      });
      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng này');
      }

      order.status = -1;
      await this.orderRepository.save(order);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Xóa thành công đơn hàng')
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
        .message('Đã có lỗi xảy ra...')
        .build();
    }
  }
}
