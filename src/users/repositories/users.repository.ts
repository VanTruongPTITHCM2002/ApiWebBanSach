import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Account } from '@/accounts/entities/account.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@InjectRepository(User) repo: Repository<User>) {
    super(repo, 'user');
  }

  findByAccountId(accountId: string): Promise<User | null> {
    return this.repo.findOne({
      where: { accountFK: { accountId } },
    });
  }

  findActive(): Promise<User[]> {
    return this.repo.find({ where: { isActive: true } });
  }

  findAllWithCarts(): Promise<User[]> {
    return this.repo.find({
      relations: ['carts', 'carts.cartItemId'],
    });
  }

  async findOrCreateProfile(account: Account): Promise<User> {
    const existing = await this.findByAccountId(account.accountId);
    if (existing) {
      return existing;
    }

    return this.create({
      firstname: account.username,
      lastname: '',
      email: `${account.username}@bookstore.local`,
      address: '',
      phone: '',
      accountFK: account,
      isActive: true,
    });
  }
}
