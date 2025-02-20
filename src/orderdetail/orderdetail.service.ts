import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Orderdetail } from './entities/orderdetail.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Cartitem } from 'src/cartitems/entities/cartitem.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Cart } from 'src/carts/entities/cart.entity';
import { Book } from 'src/books/entities/book.entity';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';

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
        where: { cartId: { cartId: createOrderdetailDto.cartId } },
      });

      const orderDetail = cartItems.map((c) => ({
        bookId: c.bookId,
        price: c.price,
        quantity: c.quantity,
        orderId: newOder,
      }));
      await this.orderDetailRepository.save(orderDetail);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.CREATED)
        .message('Tạo chi tiết đơn hàng thành công với mã ' + newOder.orderId)
        .build();
    } catch (error: any) {}
    return 'This action adds a new orderdetail';
  }

  findAll() {
    return `This action returns all orderdetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderdetail`;
  }

  update(id: number, updateOrderdetailDto: UpdateOrderdetailDto) {
    return `This action updates a #${id} orderdetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderdetail`;
  }
}
