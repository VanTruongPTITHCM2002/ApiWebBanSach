import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PageResult } from '../interfaces/page-result.interface';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected constructor(
    protected readonly repo: Repository<T>,
    protected readonly alias: string,
  ) {}

  protected get primaryKey(): string {
    return this.repo.metadata.primaryColumns[0].propertyName;
  }

  protected query(): SelectQueryBuilder<T> {
    return this.repo.createQueryBuilder(this.alias);
  }

  protected toPage<U>(
    content: U[],
    totalElements: number,
    page: number,
    size: number,
  ): PageResult<U> {
    const totalPages = Math.ceil(totalElements / size);

    return {
      content,
      page,
      size,
      totalElements,
      totalPages,
      first: page === 1,
      last: page >= totalPages,
    };
  }

  findById(id: string, relations: string[] = []): Promise<T | null> {
    return this.repo.findOne({
      where: { [this.primaryKey]: id } as FindOptionsWhere<T>,
      relations,
    });
  }

  findOne(
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations: string[] = [],
    order?: FindOptionsOrder<T>,
  ): Promise<T | null> {
    return this.repo.findOne({ where, relations, order });
  }

  findMany(
    where: FindOptionsWhere<T> = {},
    order?: FindOptionsOrder<T>,
    relations: string[] = [],
  ): Promise<T[]> {
    return this.repo.find({ where, order, relations });
  }

  create(data: DeepPartial<T>): Promise<T> {
    return this.repo.save(this.repo.create(data));
  }

  createMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.repo.save(this.repo.create(data));
  }

  save(entity: T): Promise<T> {
    return this.repo.save(entity);
  }

  async updateById(id: string, data: QueryDeepPartialEntity<T>): Promise<void> {
    await this.repo.update(id, data);
  }

  async deleteById(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    return this.repo.exists({ where });
  }

  count(where: FindOptionsWhere<T> = {}): Promise<number> {
    return this.repo.count({ where });
  }
}
