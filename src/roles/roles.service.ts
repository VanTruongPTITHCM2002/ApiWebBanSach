import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.save(createRoleDto);
  }

  async findAll() {
    let roles: Role[];
    try {
      roles = await this.roleRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Không thể lấy danh sách quyền');
    }

    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Danh sách quyền')
      .data(roles)
      .build();
  }

  findOne(roleId: number): Promise<Role | null> {
    return this.roleRepository.findOneBy({ roleId });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(id, updateRoleDto);
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
