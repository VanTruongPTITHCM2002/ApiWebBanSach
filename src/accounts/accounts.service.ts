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
import { ApiResponse } from 'src/response/apires';
import { Builder } from 'builder-pattern';
import { AccountResponse } from './dto/accountResponse';
import { convertStatus } from 'src/utils/convertStatusAccount';
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
    });

    // Lưu tài khoản vào cơ sở dữ liệu
    return await this.accountRepository.save(account);
  }

  async findAll() {
    try {
      const accounts = await this.accountRepository.find();
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Cập nhật tài khoản thành công')
        .data(
          accounts.map(
            (account) =>
              new AccountResponse(
                account.username,
                convertStatus(account.status),
                account.createdAt.toLocaleString(),
              ),
          ),
        )
        .build();
    } catch (error: any) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Lỗi từ cơ sở dữ liệu..')
        .data('')
        .build();
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
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Thông tin tài khoản ' + id)
        .data(response)
        .build();
    } catch (err: any) {
      if (err instanceof HttpException) {
        // Nếu lỗi là HttpException, trả về đúng status và message
        return Builder<ApiResponse<any>>()
          .statusCode(err.getStatus())
          .message(err.message)
          .data('')
          .build();
      } else {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
          .message('Lỗi từ cơ sở dữ liệu..')
          .data('')
          .build();
      }
    }
  }

  async update(
    username: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<ApiResponse<any>> {
    try {
      await this.accountRepository.update(username, updateAccountDto);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Cập nhật tài khoản thành công')
        .data('')
        .build();
    } catch (err: any) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Cập nhật tài khoản thất bại')
        .data('')
        .build();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
