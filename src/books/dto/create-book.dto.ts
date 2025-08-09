import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @Length(4, 45)
  title: string;

  @IsNotEmpty()
  @Length(4, 45)
  authorName: string | number;

  @IsNotEmpty()
  @Length(4, 45)
  publisherName: string | number;

  @IsNotEmpty()
  @Length(4, 45)
  categoryName: string | number;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  stock: number;

  @IsOptional()
  link?: string;
}
