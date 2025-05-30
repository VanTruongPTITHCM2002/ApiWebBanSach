import { ApiResponse } from './../response/apires';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { Builder } from 'builder-pattern';
import { User } from 'src/users/entities/user.entity';
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createCartDto: CreateCartDto) {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: createCartDto.username },
      });
      if (!account) {
        throw new NotFoundException('Không tìm thấy tài khoản này');
      }

      const user = await this.userRepository.findOne({
        where: { accountFK: { accountId: account.accountId } },
      });
      if (!user) {
        throw new NotFoundException(
          'Không tìm thấy user tương thích với tài khoản',
        );
      }
      const cart = await this.cartRepository.create({
        usersId: user,
        createAt: createCartDto.createAt,
        status: true,
      });
      await this.cartRepository.save(cart);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.CREATED)
        .message('Tạo giỏ hàng thành công')
        .build();
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message(error.message)
          .build();
      }
      console.log(error);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Lỗi xảy ra từ cơ sở dữ liệu....')
        .build();
    }
  }

  async findAll() {
    try {
      const carts = await this.cartRepository.find();
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Láy danh sách giỏ hàng của tất cả tài khoản')
        .data(carts)
        .build();
    } catch (error: any) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Lỗi xảy ra từ cơ sở dữ liệu....')
        .build();
    }
  }

  async findOne(username: string) {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: username },
      });
      if (!account) {
        throw new NotFoundException('Không tìm thấy tài khoản này');
      }
      const user = await this.userRepository.findOne({
        where: {
          accountFK: {
            username: account.username,
          },
        },
      });
      if (!user) {
        throw new NotFoundException(
          'Không tìm thấy user tương thích với tài khoản',
        );
      }
      const cart = await this.cartRepository.findOne({
        where: {
          usersId: {
            usersId: user.usersId,
          },
        },
        relations: ['cartItemId', 'cartItemId.bookId'],
      });

      const result = {
        cartId: cart.cartId,
        createAt: cart.createAt,
        status: cart.status,
        cartItems: cart.cartItemId.map((item) => ({
          cartItemId: item.cartitemId,
          quantity: item.quantity,
          price: item.price,
          title: item.bookId.title,
        })),
      };
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Danh sách giỏ hàng của ' + username)
        .data(result)
        .build();
    } catch (error: any) {
      console.log(error);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Lỗi xảy ra từ cơ sở dữ liệu....')
        .build();
    }
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    try {
      const cart = await this.cartRepository.findOne({ where: { cartId: id } });
      if (!cart) {
        throw new NotFoundException('Không tìm thấy giỏ hàng này');
      }
      cart.createAt = updateCartDto.createAt;
      cart.status = updateCartDto.status === 'Đang chờ' ? false : true;
      this.cartRepository.save(cart);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Cập nhật thành công trạng thái giỏ hàng')
        .build();
    } catch (error: any) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Lỗi xảy ra từ cơ sở dữ liệu....')
        .build();
    }
  }

  async remove(id: number) {
    try {
      const cart = await this.cartRepository.findOne({
        where: { cartId: id },
      });
      if (!cart) {
        throw new NotFoundException('Không tìm thấy giỏ hàng này');
      }
      await this.cartRepository.delete(cart);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Xóa giỏ hàng thành công')
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
        .message('Lỗi xảy ra từ cơ sở dữ liệu....')
        .build();
    }
  }
}
