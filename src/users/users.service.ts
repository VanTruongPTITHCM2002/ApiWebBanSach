import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Account } from '@/accounts/entities/account.entity';
import { ApiRes } from '@/response/response.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async createProfileForAccount(account: Account): Promise<User> {
    return this.userRepository.findOrCreateProfile(account);
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return ApiRes.created('Thêm thành công thông tin cá nhân', user);
  }

  findAll() {
    return this.userRepository.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async getNumberOfUsers() {
    const users = await this.userRepository.count({ isActive: true });
    return ApiRes.success('Lấy số lượng người dùng thành công', users);
  }
}
