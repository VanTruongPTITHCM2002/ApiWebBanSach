import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartitemDto } from './dto/create-cartitem.dto';
import { UpdateCartitemDto } from './dto/update-cartitem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cartitem } from './entities/cartitem.entity';
import { Builder } from 'builder-pattern';
import { ApiResponse } from '@/response/apires';
import { Cart } from '@/carts/entities/cart.entity';
import { Account } from '@/accounts/entities/account.entity';
import { User } from '@/users/entities/user.entity';
import { Book } from '@/books/entities/book.entity';

@Injectable()
export class CartitemsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Cartitem)
    private readonly cartItemRepository: Repository<Cartitem>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}
  async create(createCartitemDto: CreateCartitemDto) {
    try {
      // Tìm tài khoản, user và sách đồng thời để giảm số lần truy vấn
      const [account, book] = await Promise.all([
        this.accountRepository.findOne({
          where: { username: createCartitemDto.cartDto.username },
        }),
        this.bookRepository.findOne({
          where: { title: createCartitemDto.bookName },
        }),
      ]);

      if (!account) throw new NotFoundException('Không tìm thấy tài khoản này');

      const user = await this.userRepository.findOne({
        where: { accountFK: { accountId: account.accountId } },
      });

      if (!user)
        throw new NotFoundException(
          'Không tìm thấy user tương thích với tài khoản',
        );

      if (!book) throw new NotFoundException('Không tìm thấy sách này');

      if (book.stock < createCartitemDto.quantity)
        throw new BadRequestException('Không đủ số lượng sách');
      // Tạo giỏ hàng

      let cartExists = await this.cartRepository.findOne({
        where: {
          usersId: { usersId: user.usersId },
          isActive: true,
        },
      });

      if (!cartExists) {
        cartExists = await this.cartRepository.save({
          usersId: user,
          createAt: new Date(createCartitemDto.cartDto.createAt),
          isActive: true,
        });
      }

      const isBookExistsCart = await this.cartItemRepository.findOne({
        where: {
          carts: { cartId: cartExists.cartId },
          bookId: { bookid: book.bookid },
        },
      });

      if (isBookExistsCart) {
        createCartitemDto.quantity += isBookExistsCart.quantity;
        await this.cartItemRepository.update(isBookExistsCart.cartitemId, {
          quantity: createCartitemDto.quantity,
        });
      } else {
        await this.cartItemRepository.save({
          carts: cartExists,
          bookId: book,
          price: book.price,
          quantity: createCartitemDto.quantity,
        });
      }

      book.stock -= createCartitemDto.quantity;
      await this.bookRepository.save(book);

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.CREATED)
        .message('Tạo giỏ hàng thành công')
        .build();
    } catch (error: any) {
      // Xử lý lỗi NotFound hoặc BadRequest
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        return Builder<ApiResponse<any>>()
          .statusCode(error.getStatus())
          .message(error.message)
          .build();
      }

      // Xử lý lỗi không lường trước
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message(error.message)
        .build();
    }
  }

  async findAll() {
    try {
      const user = await this.userRepository.find({
        relations: ['carts', 'carts.cartItemId'],
      });

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Danh sách giỏ hàng của người dùng')
        .data(user)
        .build();
    } catch (error: any) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Lỗi từ cơ sở dữ liệu...')
        .build();
    }
  }

  async findOne(id: string) {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: id },
      });

      if (!account) {
        throw new NotFoundException(`Không tìm thấy người dùng ${id}`);
      }

      const userWithCart = await this.userRepository.find({
        relations: ['carts', 'carts.cartItemId'],
        where: { accountFK: { accountId: account.accountId } },
      });

      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message(`Danh sách giỏ hàng của ${id}`)
        .data(userWithCart)
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
        .message('Lỗi đến từ cơ sở dữ liệu...')
        .build();
    }
  }

  async update(id: string, updateCartitemDto: UpdateCartitemDto) {
    try {
      const [cart, book] = await Promise.all([
        this.cartRepository.findOne({
          where: { cartId: id },
        }),
        this.bookRepository.findOne({
          where: { title: updateCartitemDto.bookName },
        }),
      ]);

      if (!cart) {
        throw new NotFoundException('Không tìm thấy giỏ hàng này');
      }

      if (!book) {
        throw new NotFoundException('Không tìm thấy sách này');
      }
      console.log(updateCartitemDto.cartItemId);
      const cartItemUser = await this.cartItemRepository.findOne({
        where: {
          // cartId: { cartId: cart.cartId },
          // bookId: {
          //   title: updateCartitemDto.bookName,
          // },
          cartitemId: updateCartitemDto.cartItemId,
        },
      });

      console.log(cartItemUser);

      if (!cartItemUser) {
        await this.cartItemRepository.save({
          cartId: cart,
          bookId: book,
          price: book.price,
          quantity: updateCartitemDto.quantity,
        });

        book.stock = book.stock - updateCartitemDto.quantity;
        await this.bookRepository.save(book);
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.CREATED)
          .message('Thêm sách vào giỏ hàng thành công')
          .build();
      }

      if (cartItemUser.quantity > updateCartitemDto.quantity) {
        book.stock =
          book.stock + (cartItemUser.quantity - updateCartitemDto.quantity);
        cartItemUser.quantity = updateCartitemDto.quantity;
      } else {
        book.stock =
          book.stock - (updateCartitemDto.quantity - cartItemUser.quantity);
        cartItemUser.quantity =
          cartItemUser.quantity +
          (updateCartitemDto.quantity - cartItemUser.quantity);
      }
      await Promise.all([
        await this.cartItemRepository.save(cartItemUser),
        await this.bookRepository.save(book),
      ]);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Cập nhật giỏ hàng thành công')
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
        .message('Lỗi từ cơ sở dữ liệu...')
        .build();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} cartitem`;
  }
}
