import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { ApiRes } from '@/response/response.dto';
import { RolesRepository } from './repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RolesRepository) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.create(createRoleDto);
  }

  async findAll() {
    const roles = await this.roleRepository.findMany();

    return ApiRes.success('Danh sách quyền', roles);
  }

  findOne(roleId: string): Promise<Role | null> {
    return this.roleRepository.findById(roleId);
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.updateById(id, updateRoleDto);
  }

  remove(id: string) {
    return this.roleRepository.deleteById(id);
  }
}
