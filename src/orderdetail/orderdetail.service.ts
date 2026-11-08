import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { ApiRes } from '@/response/response.dto';
import { OrdersRepository } from '@/orders/repositories/orders.repository';
import { OrderDetailsRepository } from './repositories/orderdetail.repository';
import { BooksRepository } from '@/books/repositories/books.repository';
import { OrderdetailMapper } from './mappers/orderdetail.mapper';

@Injectable()
export class OrderdetailService {
  constructor(
    private readonly orderRepository: OrdersRepository,
    private readonly orderDetailRepository: OrderDetailsRepository,
    private readonly bookRepository: BooksRepository,
    private readonly orderdetailMapper: OrderdetailMapper,
  ) {}

  async create(createOrderdetailDto: CreateOrderdetailDto) {
    const result = await this.orderRepository.createFromCart({
      username: createOrderdetailDto.username,
      cartId: createOrderdetailDto.cartId,
      methodPay: createOrderdetailDto.methodPay,
      customerName: createOrderdetailDto.customerName,
      phone: createOrderdetailDto.phone,
      address: createOrderdetailDto.address,
    });

    if ('reason' in result) {
      throw new NotFoundException(
        this.checkoutFailureMessage(result.reason, createOrderdetailDto),
      );
    }

    return ApiRes.created(
      'Tạo chi tiết đơn hàng thành công với mã ' + result.order.orderCode,
      this.orderdetailMapper.toCreatedResponse(
        result.order,
        result.totalAmount,
      ),
    );
  }

  async findAll() {
    const orderDetail = await this.orderDetailRepository.findMany();
    return ApiRes.success(
      'Lấy danh sách chi tiết đơn hàng thành công',
      orderDetail,
    );
  }

  async findOne(orderId: string) {
    const orderDetail = await this.orderDetailRepository.findByOrder(orderId);
    return ApiRes.success('Lấy chi tiết đơn hàng thành công', orderDetail);
  }

  async update(id: string, updateOrderdetailDto: UpdateOrderdetailDto) {
    const book = await this.bookRepository.findByTitle(
      updateOrderdetailDto.bookName,
    );

    if (!book) {
      throw new NotFoundException(
        'Không tìm thấy sách ' + updateOrderdetailDto.bookName,
      );
    }

    const order = await this.orderRepository.findByIdOrCode(id);

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng này');
    }

    const orderDetail = await this.orderDetailRepository.findByOrderAndBook(
      id,
      book.bookid,
    );

    if (!orderDetail) {
      throw new NotFoundException('Không tìm thấy sách trong đơn hàng này');
    }

    await this.orderDetailRepository.updateQuantity(
      orderDetail.orderdetailId,
      updateOrderdetailDto.quantity,
    );

    return ApiRes.success('Cập nhật đơn hàng thành công');
  }

  remove(id: number) {
    return `This action removes a #${id} orderdetail`;
  }

  async getTopFiveBooks() {
    const result = await this.orderDetailRepository.topFiveBooks();
    return ApiRes.success(
      'Lấy thành công danh sách top 5 sách bán chạy',
      result,
    );
  }

  private checkoutFailureMessage(
    reason: string,
    dto: CreateOrderdetailDto,
  ): string {
    switch (reason) {
      case 'ACCOUNT_NOT_FOUND':
        return 'Không tìm thấy tài khoản ' + dto.username;
      case 'USER_NOT_FOUND':
        return 'Không tìm người dùng ứng với tài khoản này';
      case 'CART_NOT_FOUND':
        return 'Không tìm thấy giỏ hàng này';
      default:
        return 'Giỏ hàng đang trống';
    }
  }
}
