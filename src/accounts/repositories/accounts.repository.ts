import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Account } from '../entities/account.entity';
import { Role } from '@/roles/entities/role.entity';
import { User } from '@/users/entities/user.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

export interface CreateAccountWithProfileInput {
  username: string;
  password: string;
  role: Role;
}

@Injectable()
export class AccountsRepository extends BaseRepository<Account> {
  constructor(@InjectRepository(Account) repo: Repository<Account>) {
    super(repo, 'account');
  }

  findByUsername(username: string, withRole = false): Promise<Account | null> {
    return this.repo.findOne({
      where: { username },
      relations: withRole ? ['roleId'] : [],
    });
  }

  existsByUsername(username: string): Promise<boolean> {
    return this.exists({ username });
  }

  findActivePage(page: number, size: number): Promise<[Account[], number]> {
    return this.repo.findAndCount({
      where: { isActive: true },
      skip: (page - 1) * size,
      take: size,
    });
  }

  async updateByUsername(
    username: string,
    data: QueryDeepPartialEntity<Account>,
  ): Promise<void> {
    await this.repo.update({ username }, data);
  }

  createWithProfile(input: CreateAccountWithProfileInput): Promise<Account> {
    return this.repo.manager.transaction(async (manager) => {
      const accountRepo = manager.getRepository(Account);
      const userRepo = manager.getRepository(User);

      const accountData: DeepPartial<Account> = {
        username: input.username,
        password: input.password,
        roleId: input.role,
        isActive: true,
      };

      const account = await accountRepo.save(accountRepo.create(accountData));

      await userRepo.save(
        userRepo.create({
          firstname: account.username,
          lastname: '',
          email: `${account.username}@bookstore.local`,
          address: '',
          phone: '',
          accountFK: account,
          isActive: true,
        }),
      );

      return account;
    });
  }
}
