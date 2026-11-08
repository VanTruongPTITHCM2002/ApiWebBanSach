import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Author } from '../entities/author.entity';
import { FilterAuthorQueryDto } from '../dto/filter-author-query-dto';
import { BaseRepository } from '@/common/repositories/base.repository';
import { PageResult } from '@/common/interfaces/page-result.interface';

@Injectable()
export class AuthorsRepository extends BaseRepository<Author> {
  constructor(@InjectRepository(Author) repo: Repository<Author>) {
    super(repo, 'author');
  }

  findByName(firstname: string, lastname: string): Promise<Author | null> {
    return this.repo.findOne({ where: { firstname, lastname } });
  }

  findByNameContaining(name: string): Promise<Author[]> {
    return this.repo.find({
      where: { firstname: ILike(`%${name}%`) },
    });
  }

  findByLastNameWithBooks(lastname: string): Promise<Author | null> {
    return this.repo.findOne({
      where: { lastname },
      relations: ['books'],
    });
  }

  findByIdWithBooks(id: string): Promise<Author | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['books'],
    });
  }

  findActive(): Promise<Author[]> {
    return this.repo.find({ where: { isActive: true } });
  }

  async findPage(
    page: number,
    size: number,
    filters: FilterAuthorQueryDto,
  ): Promise<PageResult<Author>> {
    let where: FindOptionsWhere<Author> | FindOptionsWhere<Author>[] = {};

    if (filters?.search) {
      where = [
        { firstname: ILike(`%${filters.search}%`) },
        { lastname: ILike(`%${filters.search}%`) },
        { country: ILike(`%${filters.search}%`) },
      ];
    }

    const [content, totalElements] = await this.repo.findAndCount({
      skip: (page - 1) * size,
      take: size,
      where,
    });

    return this.toPage(content, totalElements, page, size);
  }
}
