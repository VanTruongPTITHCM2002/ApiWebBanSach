import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiRes } from '@/response/response.dto';
import { CartsRepository } from './repositories/carts.repository';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { UsersRepository } from '@/users/repositories/users.repository';
import { CartMapper } from './mappers/cart.mapper';

@Injectable()
export class CartsService {
  constructor(
    private readonly cartRepository: CartsRepository,
    private readonly accountRepository: AccountsRepository,
    private readonly userRepository: UsersRepository,
    private readonly cartMapper: CartMapper,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const account = await this.accountRepository.findByUsername(
      createCartDto.username,
    );

    if (!account) {
      throw new NotFoundException('Không tìm thấy tài khoản này');
    }

    const user = await this.userRepository.findOrCreateProfile(account);

    await this.cartRepository.create({
      usersId: user,
      createAt: createCartDto.createAt,
      isActive: true,
    });

    return ApiRes.created('Tạo giỏ hàng thành công');
  }

  async findAll() {
    const carts = await this.cartRepository.findMany();

    return ApiRes.success('Láy danh sách giỏ hàng của tất cả tài khoản', carts);
  }

  async findOne(username: string) {
    const account = await this.accountRepository.findByUsername(username);

    if (!account) {
      throw new NotFoundException('Không tìm thấy tài khoản này');
    }

    const user = await this.userRepository.findOrCreateProfile(account);
    const cart = await this.cartRepository.findActiveByUserId(user.usersId);

    if (!cart) {
      return ApiRes.success(
        'Giỏ hàng trống',
        this.cartMapper.toEmptyResponse(),
      );
    }

    return ApiRes.success(
      'Danh sách giỏ hàng của ' + username,
      this.cartMapper.toResponse(cart),
    );
  }

  async update(id: string, updateCartDto: UpdateCartDto) {
    const cart = await this.cartRepository.findById(id);

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng này');
    }

    cart.createAt = updateCartDto.createAt;
    cart.isActive = updateCartDto.status === 'Đang chờ' ? false : true;

    await this.cartRepository.save(cart);

    return ApiRes.success('Cập nhật thành công trạng thái giỏ hàng');
  }

  async remove(id: string) {
    const cart = await this.cartRepository.findById(id);

    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng này');
    }

    await this.cartRepository.deleteById(cart.cartId);

    return ApiRes.success('Xóa giỏ hàng thành công');
  }
}
