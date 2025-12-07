import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateBookDto {
  // @IsDefined({ message: 'Không được phép bỏ qua tiêu đề' })
  @IsNotEmpty({ message: 'Không được phép bỏ trống tiêu đề' })
  @MaxLength(45, { message: 'Độ dài tiêu đề tối đa là 45 kí tự' })
  title: string;

  @IsNotEmpty({ message: 'Không được phép để trống tên tác giả' })
  // @IsDefined({ message: 'Không được phép bỏ qua tên tác giả' })
  @MaxLength(45, { message: 'Độ dài tên của tác giả tối đa là 45 kí tự' })
  authorName: string | number;

  @IsNotEmpty({ message: 'Không được phép để trống tên nhà xuất bản' })
  // @IsDefined({ message: 'Không được phép bỏ qua tên nhà xuất bản' })
  @MaxLength(45, { message: 'Độ dài của nhà xuất bản tối đa 45 kí tự' })
  publisherName: string | number;

  @IsNotEmpty({ message: 'Không được phép để trống tên danh mục sách' })
  // @IsDefined({ message: 'Không được phép bỏ qua tên danh mục sách' })
  @MaxLength(45, { message: 'Độ dài của tên danh mục sách tôi đa 45 kí tự' })
  categoryName: string | number;

  @IsNotEmpty({ message: 'Không được phép để trống giá sách' })
  // @IsDefined({ message: 'Không được phép bỏ qua giá sách' })
  // @IsNumber({}, { message: 'Giá sách phải là số' })
  price: number;

  @IsNotEmpty({ message: 'Không được phép để trống số lượng sách' })
  // @IsDefined({ message: 'Không được phép bỏ qua số lượng sách' })
  // @IsNumber({}, { message: 'Số lượng sách phải là số' })
  stock: number;

  @IsOptional()
  link?: string;
}
