import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Không được phép bỏ trống tiêu đề' })
  @MaxLength(45, { message: 'Độ dài tiêu đề tối đa là 45 kí tự' })
  title: string;

  @IsNotEmpty({ message: 'Không được phép để trống tác giả' })
  @IsUUID('4', { message: 'Mã tác giả sai định dạng' })
  authorId: string;

  @IsNotEmpty({ message: 'Không được phép để trống tên nhà xuất bản' })
  @IsUUID('4', { message: 'Mã nhà xuất bản sai định dạng' })
  publisherId: string;

  @IsNotEmpty({ message: 'Không được phép để trống tên danh mục sách' })
  @IsUUID('4', { message: 'Mã thể loại sai định dạng' })
  categoryId: string;

  @IsNotEmpty({ message: 'Không được phép để trống giá sách' })
  // @IsPositive({ message: 'Giá phải lớn hơn 0' })
  price: number;

  @IsNotEmpty({ message: 'Không được phép để trống số lượng sách' })
  // @IsPositive({ message: 'Số lượng phải lớn hơn 0' })
  stock: number;

  @IsOptional()
  files: File[];

  @IsOptional()
  link?: string;
}
