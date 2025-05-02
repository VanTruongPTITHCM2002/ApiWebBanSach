import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';
import { AccountResponse } from './dto/accountResponse';
import { convertStatus } from 'src/utils/convertStatusAccount';
import { ApiRes } from 'src/response/response.dto';
@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  private readonly logger = new Logger(AccountsService.name);

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const { password, ...rest } = createAccountDto;
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const role = await this.roleRepository.findOne({
      where: { roleName: 'CUSTOMER' },
    });
    if (!role) {
      throw new NotFoundException('Role "CUSTOMER" not found');
    }

    // Tạo đối tượng account với vai trò "Customer"
    const account = this.accountRepository.create({
      ...rest,
      password: hashedPassword,
      roleId: role,
      status: true,
    });

    // Lưu tài khoản vào cơ sở dữ liệu
    return await this.accountRepository.save(account);
  }

  async findAll(page: number, size: number) {
    const skip = (page - 1) * size;
    const take = size;
    try {
      const accounts = await this.accountRepository.findAndCount({
        skip: skip,
        take: take,
      });
      this.logger.log('Lấy danh sách tài khoản thành công');
      return ApiRes.success('Lấy danh sách tài khoản thành công', {
        result: accounts[0].map(
          (account) =>
            new AccountResponse(
              account.username,
              convertStatus(account.status),
              account.createdAt.toLocaleString(),
            ),
        ),
        page: skip + 1,
        size: take,
      });
    } catch (error: any) {
      this.logger.error(error.message);
      return ApiRes.error('Đã có lỗi xảy ra...', 'Thất bại');
    }
  }

  async findOne(id: string) {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: id },
      });
      if (account === null) {
        this.logger.error('Không tìm thấy tài khoản');
        return ApiRes.notFound('Không tìm thấy tài khoản', 'Thất bại');
      }
      const response = new AccountResponse(
        account.username,
        convertStatus(account.status),
        account.createdAt.toLocaleString(),
      );
      this.logger.log('Tạo tài khoản thành công');
      return ApiRes.success('Thông tin tài khoản ' + id, response);
    } catch (err: any) {
      this.logger.error('Đã có lỗi xảy ra');
      console.log(err.message);
      return ApiRes.internalServerError('Đã có lỗi xảy ra', 'Thất bại');
    }
  }

  async update(username: string, updateAccountDto: UpdateAccountDto) {
    try {
      await this.accountRepository.update(username, updateAccountDto);
      this.logger.log('Cập nhật tài khoản thành công');
      return ApiRes.success('Cập nhật tài khoản thành công', '');
    } catch (err: any) {
      this.logger.log('Đã có lỗi xảy ra');
      console.log(err.message);
      return ApiRes.internalServerError('Đã có lỗi xảy ra', 'Thất bại');
    }
  }

  async remove(id: number) {
    try {
      const account = await this.accountRepository.findOne({
        where: { accountId: id },
      });
      if (!account) {
        this.logger.error('Không tìm thấy tài khoản');
        return ApiRes.notFound('Không tìm thấy tài khoản', 'Thất bại');
      }
      account.status = false;
      await this.accountRepository.save(account);
      this.logger.log('Xóa tài khoản thành công');
      return ApiRes.success('Xóa tài khoản thành công', '');
    } catch (err: any) {
      this.logger.error('Đã có lỗi xảy ra');
      console.log(err.message);
      return ApiRes.internalServerError('Đã có lỗi xảy ra', 'Thất bại');
    }
  }
}
