import { Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '@/enum/role.enum';
import { AccountsRepository } from '@/accounts/repositories/accounts.repository';
import { RolesRepository } from '@/roles/repositories/roles.repository';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly accountRepository: AccountsRepository,
    private readonly roleRepository: RolesRepository,
  ) {}

  async onModuleInit() {
    for (const roleName of Object.values(RoleEnum)) {
      const existed = await this.roleRepository.exists({ roleName });
      if (existed) {
        continue;
      }
      await this.roleRepository.create({ roleName });
    }

    const accountExists = await this.accountRepository.exists({
      username: process.env.USER_INIT,
    });

    if (accountExists) {
      return;
    }

    const role = await this.roleRepository.findByName(RoleEnum.ADMIN);
    if (!role) {
      return;
    }

    await this.accountRepository.create({
      username: process.env.USER_INIT,
      password: await bcrypt.hash(process.env.PASSWORD_INIT, 10),
      isActive: true,
      roleId: role,
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
