import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { BaseRepository } from '@/common/repositories/base.repository';

@Injectable()
export class RolesRepository extends BaseRepository<Role> {
  constructor(@InjectRepository(Role) repo: Repository<Role>) {
    super(repo, 'role');
  }

  findByName(roleName: string): Promise<Role | null> {
    return this.repo.findOne({ where: { roleName } });
  }
}
