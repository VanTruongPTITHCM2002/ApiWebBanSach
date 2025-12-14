export class FilterBookQueryDto {
  page?: number;
  size?: number;
  title?: string;
  categoryId?: string;
  authorId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string | boolean;
  publisherId: string;
}
