import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiRes } from '@/response/response.dto';
import { OrdersRepository, RevenueRow } from './repositories/orders.repository';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { OrderMapper } from './mappers/order.mapper';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly accountRepository: AccountsRepository,
    private readonly userRepository: UsersRepository,
    private readonly orderMapper: OrderMapper,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const account = await this.accountRepository.findByUsername(
      createOrderDto.username,
    );

    if (!account) {
      throw new NotFoundException('Không tìm thấy tài khoản này');
    }

    const user = await this.userRepository.findByAccountId(account.accountId);

    if (!user) {
      throw new NotFoundException(
        'Không tìm thấy người dùng tương ứng tài khoản',
      );
    }

    const savedOrder = await this.orderRepository.create({
      userId: user,
      orderDate: createOrderDto.orderDate,
      workflowStatus: 1,
      totalAmount: 0,
      isActive: true,
    });

    return ApiRes.created('Tạo đơn hàng thành công', {
      orderId: savedOrder.orderId,
      orderCode: savedOrder.orderCode,
    });
  }

  async findAll(page: number, size: number) {
    page = Number(page) || 1;
    size = Number(size) || 5;

    const result = await this.orderRepository.findPage(page, size);
    return ApiRes.success('Lấy thành công danh sách đơn hàng', result);
  }

  async findByUsername(username: string, page: number, size: number) {
    page = Number(page) || 1;
    size = Number(size) || 50;

    const result = await this.orderRepository.findPageByUsername(
      username,
      page,
      size,
    );

    return ApiRes.success('Lấy thành công danh sách đơn hàng của bạn', result);
  }

  async findOne(id?: string) {
    const order = await this.orderRepository.findByIdOrCodeWithDetails(id);

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng có mã trên');
    }

    return ApiRes.success(
      'Tìm thấy thành công đơn hàng ' + order.orderCode,
      this.orderMapper.toResponse(order),
    );
  }

  async findByDate(orderDate: string) {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

    if (!dateRegex.test(orderDate)) {
      throw new BadRequestException('Định dạng ngày tháng không hợp lệ');
    }

    const [day, month, year] = orderDate.split('-').map(Number);
    const parseDate = new Date(Date.UTC(year, month - 1, day));
    const formatDate = parseDate.toISOString().split('T')[0];

    const orders = await this.orderRepository.findByDate(formatDate);
    return ApiRes.success(
      `Lấy thành công danh sách đơn hàng có ngày ${orderDate}`,
      orders,
    );
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findByIdOrCode(id);

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng có mã ${id}`);
    }

    await this.orderRepository.updateStatus(
      order.orderId,
      updateOrderDto.status,
    );

    return ApiRes.success('Cập nhật thành công trạng thái đơn hàng');
  }

  async remove(id: string) {
    const order = await this.orderRepository.findByIdOrCode(id);

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng có mã ${id}`);
    }

    await this.orderRepository.cancel(order.orderId);
    return ApiRes.success('Xóa thành công đơn hàng');
  }

  async getSumOrders() {
    const orders = await this.orderRepository.countCompleted();
    return ApiRes.success('Lấy thành công số lương đơn hàng', orders);
  }

  async getRevenueLastDays(days: number) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));

    const rawData = await this.orderRepository.revenueSince(startDate);
    const data = this.fillMissingDates(rawData, days);

    return ApiRes.success(
      `Lấy thành công doanh thu theo ${days} ngày gần nhất`,
      data,
    );
  }

  private fillMissingDates(data: RevenueRow[], days: number) {
    const result = [];
    const today = new Date();

    const revenueMap = new Map(
      data.map((item) => [item.order_date, Number(item.total_revenue)]),
    );

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      const formatted = date.toISOString().split('T')[0];

      result.push({
        order_date: formatted,
        total_revenue: revenueMap.get(formatted) || 0,
      });
    }

    return result;
  }
}
