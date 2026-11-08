import { PageResult } from '../interfaces/page-result.interface';

/**
 * Mapper cơ sở: chuyển entity sang response DTO.
 * Tương đương interface Mapper của MapStruct nhưng viết tường minh để
 * TypeScript kiểm tra kiểu ngay lúc compile.
 */
export abstract class BaseMapper<Entity, Response> {
  abstract toResponse(entity: Entity): Response;

  toResponseList(entities: Entity[]): Response[] {
    return entities.map((entity) => this.toResponse(entity));
  }

  toPage(page: PageResult<Entity>): PageResult<Response> {
    return {
      ...page,
      content: page.content.map((entity) => this.toResponse(entity)),
    };
  }
}
