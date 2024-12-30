import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/roles/entities/role.entity';
import { ApiResponse } from 'src/response/apires';
import { Builder } from 'builder-pattern';
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

  findAll() {
    return this.accountRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  async update(
    id: number,
    updateAccountDto: UpdateAccountDto,
  ): Promise<ApiResponse<any>> {
    try {
      await this.accountRepository.update(id, updateAccountDto);
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
