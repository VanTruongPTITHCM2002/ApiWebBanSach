import { Pagination } from 'nestjs-typeorm-paginate';

/**
 * Map từng item của kết quả phân trang (nestjs-typeorm-paginate) mà vẫn
 * giữ nguyên meta/links.
 */
export function mapPaginationItems<T, Response>(
  pagination: Pagination<T>,
  mapper: (item: T) => Response,
): Pagination<Response> {
  return {
    ...pagination,
    items: pagination.items.map(mapper),
  };
}
