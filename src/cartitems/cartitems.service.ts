import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartitemDto } from './dto/create-cartitem.dto';
import { UpdateCartitemDto } from './dto/update-cartitem.dto';
import { ApiRes } from '@/response/response.dto';
import { CartsRepository } from '@/carts/repositories/carts.repository';
import {
  CartItemsRepository,
  CartItemFailure,
} from './repositories/cartitems.repository';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { BooksRepository } from '@/books/repositories/books.repository';

@Injectable()
export class CartitemsService {
  constructor(
    private readonly cartRepository: CartsRepository,
    private readonly cartItemRepository: CartItemsRepository,
    private readonly accountRepository: AccountsRepository,
    private readonly userRepository: UsersRepository,
    private readonly bookRepository: BooksRepository,
  ) {}

  async create(createCartitemDto: CreateCartitemDto) {
    const account = await this.accountRepository.findByUsername(
      createCartitemDto.cartDto.username,
    );

    if (!account) {
      throw new NotFoundException('Không tìm thấy tài khoản này');
    }

    const user = await this.userRepository.findOrCreateProfile(account);
    const book = await this.bookRepository.findByTitle(
      createCartitemDto.bookName,
    );

    if (!book) {
      throw new NotFoundException('Không tìm thấy sách này');
    }

    let cart = await this.cartRepository.findActiveRawByUserId(user.usersId);

    if (!cart) {
      cart = await this.cartRepository.create({
        usersId: user,
        createAt: createCartitemDto.cartDto.createAt
          ? new Date(createCartitemDto.cartDto.createAt)
          : new Date(),
        isActive: true,
      });
    }

    const result = await this.cartItemRepository.add(
      cart.cartId,
      book.bookid,
      createCartitemDto.quantity,
    );

    if ('reason' in result) {
      this.throwFailure(result.reason);
    }

    return ApiRes.created('Tạo giỏ hàng thành công');
  }

  async findAll() {
    const user = await this.userRepository.findAllWithCarts();

    return ApiRes.success('Danh sách giỏ hàng của người dùng', user);
  }

  async findOne(id: string) {
    const account = await this.accountRepository.findByUsername(id);

    if (!account) {
      throw new NotFoundException(`Không tìm thấy người dùng ${id}`);
    }

    const userWithCart = await this.userRepository.findMany(
      { accountFK: { accountId: account.accountId } },
      undefined,
      ['carts', 'carts.cartItemId'],
    );

    return ApiRes.success(`Danh sách giỏ hàng của ${id}`, userWithCart);
  }

  async update(id: string, updateCartitemDto: UpdateCartitemDto) {
    const cart = await this.cartRepository.findById(id);

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng này');
    }

    const book = await this.bookRepository.findByTitle(
      updateCartitemDto.bookName,
    );

    if (!book) {
      throw new NotFoundException('Không tìm thấy sách này');
    }

    const result = await this.cartItemRepository.setQuantity(
      cart.cartId,
      book.bookid,
      updateCartitemDto.quantity,
      updateCartitemDto.cartItemId,
    );

    if ('reason' in result) {
      this.throwFailure(result.reason);
    }

    return result.created
      ? ApiRes.created('Thêm sách vào giỏ hàng thành công')
      : ApiRes.success('Cập nhật giỏ hàng thành công');
  }

  remove(id: number) {
    return `This action removes a #${id} cartitem`;
  }

  private throwFailure(reason: CartItemFailure): never {
    if (reason === 'BOOK_NOT_FOUND') {
      throw new NotFoundException('Không tìm thấy sách này');
    }

    throw new BadRequestException('Không đủ số lượng sách');
  }
}
