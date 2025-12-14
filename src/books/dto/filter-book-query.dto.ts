import { IsOptional } from 'class-validator';

export class FilterBookQueryDto {
  @IsOptional()
  page?: string;
  @IsOptional()
  size?: string;
  @IsOptional()
  title?: string;
  @IsOptional()
  categoryId?: string;
  @IsOptional()
  authorId?: string;
  @IsOptional()
  minPrice?: number;
  @IsOptional()
  maxPrice?: number;
  @IsOptional()
  status?: string | boolean;
  @IsOptional()
  publisherId: string;
  @IsOptional()
  category?: string;
  @IsOptional()
  stock?: number;
}
