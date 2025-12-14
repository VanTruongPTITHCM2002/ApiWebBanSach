import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orderdetail } from './entities/orderdetail.entity';
import { Builder } from 'builder-pattern';
import { Order } from '@/orders/entities/order.entity';
import { User } from '@/users/entities/user.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { Account } from '@/accounts/entities/account.entity';
import { Book } from '@/books/entities/book.entity';
import { Cartitem } from '@/cartitems/entities/cartitem.entity';
import { ApiResponse } from '@/response/apires';

@Injectable()
export class OrderdetailService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Orderdetail)
    private readonly orderDetailRepository: Repository<Orderdetail>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Cartitem)
    private readonly cartItemRepository: Repository<Cartitem>,
  ) {}
  async create(createOrderdetailDto: CreateOrderdetailDto) {
    try {
      const [account, cart] = await Promise.all([
        this.accountRepository.findOne({
          where: { username: createOrderdetailDto.username },
        }),
        this.cartRepository.findOne({
          where: { cartId: createOrderdetailDto.cartId },
        }),
      ]);

      if (!account) {
        throw new NotFoundException(
          'Không tìm thấy tài khoản ' + createOrderdetailDto.username,
        );
      }

      if (!cart) {
        throw new NotFoundException('Không tìm thấy giỏ hàng này');
      }

      const user = await this.userRepository.findOne({
        where: { accountFK: { accountId: account.accountId } },
      });

      if (!user) {
        throw new NotFoundException(
          'Không tìm người dùng ứng với tài khoản này',
        );
      }

      const order = await this.orderRepository.create({
        orderDate: new Date(),
        userId: user,
        status: 0,
        totalAmount: 0,
      });
      const newOder = await this.orderRepository.save(order);

      const cartItems = await this.cartItemRepository.find({
        where: { carts: { cartId: createOrderdetailDto.cartId } },
        relations: ['bookId'],
      });

      const orderDetail = cartItems.map((c) => ({
        books: c.bookId,
        price: c.price,
        quantity: c.quantity,
        orderId: newOder,
      }));
      await this.orderDetailRepository.save(orderDetail);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.CREATED)
        .message('Tạo chi tiết đơn hàng thành công với mã ' + newOder.orderId)
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
        .message('Có lỗi xảy ra')
        .build();
    }
  }

  async findAll() {
    try {
      const orderDetail = await this.orderDetailRepository.find();
      return Builder<ApiResponse<Orderdetail[]>>()
        .statusCode(HttpStatus.OK)
        .data(orderDetail)
        .build();
    } catch (error: any) {
      return Builder<ApiResponse<Orderdetail[]>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Có lỗi xảy ra')
        .build();
    }
  }

  async findOne(orderId: number) {
    try {
      const orderDetail = await this.orderDetailRepository.find({
        where: { orderId: { orderId: orderId } },
      });
      return Builder<ApiResponse<Orderdetail[]>>()
        .statusCode(HttpStatus.OK)
        .data(orderDetail)
        .build();
    } catch (error: any) {
      return Builder<ApiResponse<Orderdetail[]>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Có lỗi xảy ra')
        .build();
    }
  }

  async update(id: number, updateOrderdetailDto: UpdateOrderdetailDto) {
    try {
      const [order, book] = await Promise.all([
        this.orderRepository.findOne({
          where: { orderId: id },
          relations: ['orderId'],
        }),
        this.bookRepository.findOne({
          where: { title: updateOrderdetailDto.bookName },
        }),
      ]);
      if (!book) {
        throw new NotFoundException(
          'Không tìm thấy sách ' + updateOrderdetailDto.bookName,
        );
      }

      if (!order) {
        throw new NotFoundException('Không tìm thấy đơn hàng này');
      }
      const orderDetail = await this.orderDetailRepository.findOne({
        where: { orderId: { orderId: id }, books: { bookid: book.bookid } },
      });
      if (!orderDetail) {
        throw new NotFoundException('Không tìm thấy sách trong đơn hàng này');
      }
      orderDetail.quantity = updateOrderdetailDto.quantity;
      await this.orderDetailRepository.save(orderDetail);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Cập nhật đơn hàng thành công')
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
        .message('Có lỗi xảy ra')
        .build();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} orderdetail`;
  }
}
