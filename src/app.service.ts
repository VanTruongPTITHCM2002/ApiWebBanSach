import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from './accounts/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './roles/entities/role.entity';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    // throw new Error('Method not implemented.');
    const account = await this.accountRepository.findOne({
      where: { username: 'admin' },
    });

    if (!account) {
      const role = await this.roleRepository.findOne({
        where: { roleName: 'ADMIN' },
      });

      const newAccount = this.accountRepository.create({
        username: 'admin',
        password: await bcrypt.hash('admin', 10),
        createdAt: new Date(),
        status: true,
        roleId: role,
      });

      await this.accountRepository.save(newAccount);
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
