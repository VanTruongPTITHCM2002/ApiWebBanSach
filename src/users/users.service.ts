import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ApiRes } from '@/response/response.dto';
import { MessageError } from '@/enum/message.error.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let user: User = null;
    try {
      user = await this.userRepository.save(createUserDto);
      return ApiRes.created('Thêm thành công thông tin cá nhân', user);
    } catch (error: any) {
      return ApiRes.error('Không thể thêm thông tin cá nhân', 'Thất bại');
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getNumberOfUsers() {
    try {
      const users = await this.userRepository.find({
        where: {
          isActive: true,
        },
      });

      return ApiRes.success('Lấy số lượng người dùng thành công', users.length);
    } catch (error) {
      console.error('Error fetching number of users:', error.message);
      return ApiRes.internalServerError(MessageError.INTERNAL_SERVER_ERROR);
    }
  }
}
