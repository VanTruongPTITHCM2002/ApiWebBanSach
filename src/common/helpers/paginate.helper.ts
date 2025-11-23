import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { SelectQueryBuilder } from 'typeorm';

export async function paginateQuery<T>(
  queryBuilder: SelectQueryBuilder<T>,
  page = 0,
  size = 20,
): Promise<Pagination<T>> {
  return paginate<T>(queryBuilder, { page, limit: size });
}
