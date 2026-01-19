import { Injectable, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Account } from '@/accounts/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@/roles/entities/role.entity';
import { RoleEnum } from '@/enum/role.enum';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const account = await this.accountRepository.findOne({
      where: { username: process.env.USER_INIT },
    });

    if (account) {
      return;
    }

    const role = await this.roleRepository.findOne({
      where: { roleName: RoleEnum.ADMIN },
    });

    const newAccount = this.accountRepository.create({
      username: process.env.USER_INIT,
      password: await bcrypt.hash(process.env.PASSWORD_INIT, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      roleId: role,
    });

    await this.accountRepository.save(newAccount);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
