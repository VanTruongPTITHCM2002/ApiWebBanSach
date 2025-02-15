import { IsNotEmpty, IsNumber, Length } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
