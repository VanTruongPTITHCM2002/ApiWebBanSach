import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from '@/accounts/dto/update-account.dto';
import { Account } from './entities/account.entity';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from '@/enum/role.enum';
import { ApiRes } from '@/response/response.dto';
import { ConflictException } from '@/common/exception';
import { AccountsRepository } from './repositories/accounts.repository';
import { RolesRepository } from '@/roles/repositories/roles.repository';
import { AccountMapper } from './mappers/account.mapper';

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountRepository: AccountsRepository,
    private readonly roleRepository: RolesRepository,
    private readonly accountMapper: AccountMapper,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const isUsernameExist = await this.accountRepository.existsByUsername(
      createAccountDto.username,
    );

    if (isUsernameExist) {
      throw new ConflictException(
        `Tên đăng nhập "${createAccountDto.username}" đã tồn tại`,
      );
    }

    const { password, ...rest } = createAccountDto;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const role = await this.roleRepository.findByName(RoleEnum.USER);

    if (!role) {
      throw new NotFoundException(`Role "${RoleEnum.USER}" not found`);
    }

    return this.accountRepository.create({
      ...rest,
      password: hashedPassword,
      roleId: role,
      isActive: true,
    });
  }

  async findAll(page: number, size: number) {
    const [accounts, totalElements] =
      await this.accountRepository.findActivePage(page, size);

    return ApiRes.success(
      `Lấy danh sách tài khoản thành công ở trang ${page}`,
      {
        result: this.accountMapper.toResponseList(accounts),
        page,
        size,
        totalElements,
      },
    );
  }

  async findOne(id: string) {
    const account = await this.accountRepository.findByUsername(id);

    if (account === null) {
      throw new NotFoundException(`Không tìm thấy tài khoản ${id}`);
    }

    const response = this.accountMapper.toResponse(account);

    return ApiRes.success(`Thông tin tài khoản ${id}`, response);
  }

  async update(username: string, updateAccountDto: UpdateAccountDto) {
    await this.accountRepository.updateByUsername(username, updateAccountDto);
    return ApiRes.success('Cập nhật tài khoản thành công');
  }

  async remove(username: string) {
    const account = await this.accountRepository.findByUsername(username);

    if (!account) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }

    account.isActive = false;
    await this.accountRepository.save(account);
    return ApiRes.success('Xóa tài khoản thành công');
  }
}
