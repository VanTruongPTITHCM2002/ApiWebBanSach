import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findAll() {
    try {
      const accounts = await this.accountRepository.find();
      return ApiRes.success(
        'Lấy danh sách tài khoản thành công',
        accounts.map(
          (account) =>
            new AccountResponse(
              account.username,
              convertStatus(account.status),
              account.createdAt.toLocaleString(),
            ),
        ),
      );
    } catch (error: any) {
      return ApiRes.error('Lỗi từ cơ sở dữ liệu..', 'Thất bại');
    }
  }

  async findOne(id: string) {
    try {
      const account = await this.accountRepository.findOne({
        where: { username: id },
      });
      if (account === null) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Không tìm thấy tài khoản ${id}`,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const response = new AccountResponse(
        account.username,
        convertStatus(account.status),
        account.createdAt.toLocaleString(),
      );
      return ApiRes.success('Thông tin tài khoản ' + id, response);
    } catch (err: any) {
      if (err instanceof HttpException) {
        return ApiRes.notFound(err.message, 'Thất bại');
      } else {
        return ApiRes.internalServerError('Lỗi từ cơ sở dữ liệu..', 'Thất bại');
      }
    }
  }

  async update(username: string, updateAccountDto: UpdateAccountDto) {
    try {
      await this.accountRepository.update(username, updateAccountDto);
      return ApiRes.success('Cập nhật tài khoản thành công', '');
    } catch (err: any) {
      return ApiRes.internalServerError('Lỗi từ cơ sở dữ liệu..', 'Thất bại');
    }
  }

  async remove(id: number) {
    try {
      const account = await this.accountRepository.findOne({
        where: { accountId: id },
      });
      if (!account) {
        throw new NotFoundException('Không tìm thấy tài khoản');
      }
      account.status = false;
      await this.accountRepository.save(account);
      return ApiRes.success('Xóa tài khoản thành công', '');
    } catch (err: any) {
      if (err instanceof NotFoundException) {
        return ApiRes.notFound(err.message, 'Thất bại');
      }
      return ApiRes.internalServerError('Lỗi từ cơ sở dữ liệu..', 'Thất bại');
    }
  }
}
