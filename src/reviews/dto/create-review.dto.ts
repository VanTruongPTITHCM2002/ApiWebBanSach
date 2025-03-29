import {
  IsNotEmpty,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsString({ message: 'Tên người dùng phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  @Length(3, 45)
  @MinLength(3, { message: 'Tên người dùng phải có ít nhất 3 ký tự' })
  @MaxLength(45, { message: 'Tên người dùng không được quá 45 ký tự' })
  username: string;
  @IsString({ message: 'Tên sách phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên sách không được để trống' })
  @Length(10, 100)
  @MinLength(10, { message: 'Tên sách phải có ít nhất 10 ký tự' })
  @MaxLength(100, { message: 'Tên sách không được quá 100 ký tự' })
  bookName: string;
  @Max(5, { message: 'Vui lòng không được đánh giá hơn 5 sao' })
  @Min(0, { message: 'Vui lòng không được đánh giá dưới 0 sao' })
  @IsNotEmpty({ message: 'Đánh giá sao không được bỏ trống' })
  rating?: number;
  comment?: string;
  reviewDate: Date;
}
