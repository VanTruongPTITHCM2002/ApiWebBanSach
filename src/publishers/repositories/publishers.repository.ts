import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Publisher } from '../entities/publisher.entity';
import { filterPublisherQueryDto } from '../dto/filter-publisher-query-dto';
import { BaseRepository } from '@/common/repositories/base.repository';
import { PageResult } from '@/common/interfaces/page-result.interface';

@Injectable()
export class PublishersRepository extends BaseRepository<Publisher> {
  constructor(@InjectRepository(Publisher) repo: Repository<Publisher>) {
    super(repo, 'publisher');
  }

  findByName(publisherName: string): Promise<Publisher | null> {
    return this.repo.findOne({ where: { publisherName } });
  }

  findByIdOrCode(idOrCode: string): Promise<Publisher | null> {
    return this.repo.findOne({
      where: [{ publisherId: idOrCode }, { publisherCode: idOrCode }],
    });
  }

  findByIdOrCodeWithBooks(idOrCode: string): Promise<Publisher | null> {
    return this.repo.findOne({
      where: [{ publisherId: idOrCode }, { publisherCode: idOrCode }],
      relations: ['books'],
    });
  }

  async findPage(
    page: number,
    size: number,
    filters: filterPublisherQueryDto,
  ): Promise<PageResult<Publisher>> {
    let where: FindOptionsWhere<Publisher> | FindOptionsWhere<Publisher>[] = {};

    if (filters?.search) {
      where = [
        { publisherName: ILike(`%${filters.search}%`) },
        { publisherAddress: ILike(`%${filters.search}%`) },
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
