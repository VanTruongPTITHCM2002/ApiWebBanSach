import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class CartsRepository extends BaseRepository<Cart> {
  constructor(@InjectRepository(Cart) repo: Repository<Cart>) {
    super(repo, 'cart');
  }

  findActiveByUserId(usersId: string): Promise<Cart | null> {
    return this.repo.findOne({
      where: { usersId: { usersId }, isActive: true },
      relations: ['cartItemId', 'cartItemId.bookId'],
      order: { createdAt: 'DESC' },
    });
  }

  findActiveRawByUserId(usersId: string): Promise<Cart | null> {
    return this.repo.findOne({
      where: { usersId: { usersId }, isActive: true },
    });
  }

  findByIdWithItems(cartId: string): Promise<Cart | null> {
    return this.repo.findOne({
      where: { cartId },
      relations: ['cartItemId', 'cartItemId.bookId'],
    });
  }
}
