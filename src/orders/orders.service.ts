import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Account } from '@/accounts/entities/account.entity';
import { User } from '@/users/entities/user.entity';
import { ApiRes } from '@/response/response.dto';
import { MessageError } from '@/enum/message.error.enum';

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

      if (!account) return ApiRes.notFound('Không tìm thấy tài khoản này');

      const user = await this.userRepository.findOne({
        where: { accountFK: { accountId: account.accountId } },
      });

      if (!user)
        return ApiRes.notFound('Không tìm thấy người dùng tương ứng tài khoản');

      const order = this.orderRepository.create({
        userId: user,
        orderDate: createOrderDto.orderDate,
        workflowStatus: 1,
        totalAmount: 0,
        isActive: true,
      });
      await this.orderRepository.save(order);
      return ApiRes.created('Tạo đơn hàng thành công');
    } catch (error: any) {
      return ApiRes.internalServerError(error.message);
    }
  }

  async findAll(page: number, size: number) {
    try {
      const skip = (page - 1) * size;
      const take = size;
      const orders = await this.orderRepository
        .createQueryBuilder('order')
        .leftJoin('order.userId', 'user')
        .leftJoin('user.accountFK', 'account')
        .select([
          'order.orderId as orderId',
          'order.totalAmount as totalAmount',
          'order.orderDate as orderDate',
          'order.status as status',
          'order.methodPay as methodPay',
          'account.username as username',
        ])
        .addSelect("CONCAT(user.firstname, ' ', user.lastname)", 'fullName');

      const totalElements = await orders.getCount();

      const content = await orders
        .orderBy('order.orderDate', 'DESC')
        .skip(skip)
        .take(take)
        .getRawMany();

      const totalPages = Math.ceil(totalElements / size);

      return ApiRes.success('Lấy thành công danh sách đơn hàng', {
        content,
        page,
        size,
        totalElements,
        totalPages,
        first: page === 1,
        last: page >= totalPages,
      });
    } catch (error: any) {
      console.error(error.message);
      return ApiRes.internalServerError(
        'Có lỗi xảy ra trong quá trình lấy đơn hàng...',
      );
    }
  }

  async findOne(id?: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderId: id },
        relations: ['orderdetails', 'orderdetails.books'],
      });

      if (!order) return ApiRes.notFound('Không tìm thấy đơn hàng có mã trên');

      return ApiRes.success('Tìm thấy thành công đơn hàng có mã ' + id, {
        ...order,
        orderdetails: order.orderdetails.map((d) => ({
          orderdetailId: d.orderdetailId,
          image: d.books.link,
          quantity: d.quantity,
          price: d.price,
          title: d.books.title,
        })),
      });
    } catch (error: any) {
      console.error(error.message);
      return ApiRes.internalServerError(
        'Đã có lỗi xảy ra trong quá trình tìm đơn hàng..',
      );
    }
  }

  async findByDate(orderDate: string) {
    try {
      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
      if (!dateRegex.test(orderDate))
        return ApiRes.badRequest('Định dạng ngày tháng không hợp lệ');

      const [day, month, year] = orderDate.split('-').map(Number);
      const parseDate = new Date(Date.UTC(year, month - 1, day));
      const formatDate = parseDate.toISOString().split('T')[0];

      const orders = await this.orderRepository
        .createQueryBuilder('Order')
        .where('DATE(Order.orderDate) = :date', { date: formatDate })
        .getMany();
      return ApiRes.success(
        `Lấy thành công danh sách đơn hàng có ngày ${orderDate}`,
        orders,
      );
    } catch (error: any) {
      console.error(error.message);
      return ApiRes.internalServerError(
        'Có lỗi xảy ra trong quá trình tìm kiếm',
      );
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderId: id },
      });

      if (!order) return ApiRes.notFound(`Không tìm thấy đơn hàng có mã ${id}`);

      order.workflowStatus = updateOrderDto.status;
      await this.orderRepository.save(order);
      return ApiRes.success('Cập nhật thành công trạng thái đơn hàng');
    } catch (error: any) {
      console.error(error.message);
      return ApiRes.internalServerError('Không thể cập nhật đơn hàng');
    }
  }

  async remove(id: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { orderId: id },
      });
      if (!order) return ApiRes.notFound(`Không tìm thấy đơn hàng có mã ${id}`);

      order.workflowStatus = -1;
      await this.orderRepository.save(order);
      return ApiRes.success('Xóa thành công đơn hàng');
    } catch (error: any) {
      console.error(error.message);
      return ApiRes.internalServerError('Xóa đơn hàng thất bại');
    }
  }

  async getSumOrders() {
    try {
      const orders = await this.orderRepository.find({
        where: { isActive: true, workflowStatus: 1 },
      });

      return ApiRes.success('Lấy thành công số lương đơn hàng', orders.length);
    } catch (error) {
      console.error(error.message);
      return ApiRes.internalServerError(MessageError.INTERNAL_SERVER_ERROR);
    }
  }
}
