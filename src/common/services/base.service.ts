import { Repository, SelectQueryBuilder } from 'typeorm';

import { paginateQuery } from '../helpers/paginate.helper';
import { applyFilter, applySort } from '../helpers/filter.helper';
import { BaseFilterDto } from 'src/request/base-filter.dto';

export class BaseService<T> {
  constructor(
    private readonly repo: Repository<T>,
    private readonly alias = 't',
  ) {}

  protected buildQuery(): SelectQueryBuilder<T> {
    return this.repo.createQueryBuilder(this.alias);
  }

  async findAll(query: BaseFilterDto) {
    const qb = this.buildQuery();
    applyFilter(qb, query.filter, this.alias);
    applySort(qb, query.filter.sort);
    return paginateQuery(qb, query.page, query.size);
  }
}
