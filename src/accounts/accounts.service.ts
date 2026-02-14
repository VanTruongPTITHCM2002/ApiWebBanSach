import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from '@/accounts/dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '@/roles/entities/role.entity';
import { AccountResponse } from './dto/accountResponse';
import { convertStatus } from '@/utils/convertStatusAccount';
import { ApiRes } from '@/response/response.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const { password, ...rest } = createAccountDto;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const role = await this.roleRepository.findOne({
      where: { roleName: 'CUSTOMER' },
    });
    if (!role) throw new NotFoundException('Role "CUSTOMER" not found');

    const account = this.accountRepository.create({
      ...rest,
      password: hashedPassword,
      roleId: role,
      isActive: true,
    });

    return await this.accountRepository.save(account);
  }

  async findAll(page: number, size: number) {
    const skip = (page - 1) * size;
    const take = size;
    try {
      const accounts = await this.accountRepository.findAndCount({
        where: { isActive: true },
        skip: skip,
        take: take,
      });
      return ApiRes.success(
        `Lấy danh sách tài khoản thành công ở trang ${page}`,
        {
          result: accounts[0].map(
            (account) =>
              new AccountResponse(
                account.username,
                convertStatus(account.isActive),
                account.createdAt.toLocaleString(),
              ),
          ),
          page: skip + 1,
          size: take,
        },
      );
    } catch (error: any) {
      return ApiRes.error('Đã có lỗi xảy ra trong hệ thống');
    }
  }

  async findOne(id: string) {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: id },
      });
      if (account === null)
        return ApiRes.notFound(`Không tìm thấy tài khoản ${id}`);

      const response = new AccountResponse(
        account.username,
        convertStatus(account.isActive),
        account.createdAt.toLocaleString(),
      );
      return ApiRes.success(`Thông tin tài khoản ${id}`, response);
    } catch (err: any) {
      console.log(err.message);
      return ApiRes.internalServerError('Đã có lỗi xảy ra');
    }
  }

  async update(username: string, updateAccountDto: UpdateAccountDto) {
    try {
      await this.accountRepository.update(username, updateAccountDto);
      return ApiRes.success('Cập nhật tài khoản thành công');
    } catch (err: any) {
      console.log(err.message);
      return ApiRes.internalServerError('Đã có lỗi xảy ra trong hệ thống');
    }
  }

  async remove(username: string) {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: username },
      });
      if (!account) return ApiRes.notFound('Không tìm thấy tài khoản');

      account.isActive = false;
      await this.accountRepository.save(account);
      return ApiRes.success('Xóa tài khoản thành công');
    } catch (err: any) {
      console.log(err.message);
      return ApiRes.internalServerError('Đã có lỗi xảy ra trong hệ thống');
    }
  }
}
