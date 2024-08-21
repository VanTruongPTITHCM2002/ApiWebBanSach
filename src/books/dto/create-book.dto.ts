import { IsAlphanumeric, IsEmpty, IsNumber, Length } from 'class-validator';

export class CreateBookDto {
  @IsAlphanumeric()
  @IsEmpty()
  @Length(4, 45)
  title: string;

  @IsAlphanumeric()
  @IsEmpty()
  @Length(4, 45)
  authorName: string | number;

  @IsAlphanumeric()
  @IsEmpty()
  @Length(4, 45)
  publisherName: string | number;

  @IsAlphanumeric()
  @IsEmpty()
  @Length(4, 45)
  categoryName: string | number;

  @IsNumber()
  @IsEmpty()
  price: number;

  @IsNumber()
  @IsEmpty()
  stock: number;
}
