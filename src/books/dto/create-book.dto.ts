import {
  ArrayMaxSize,
  IsArray,
  IsDefined,
  IsOptional,
  IsUrl,
  IsUUID,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateBookDto {
  @IsDefined({ message: 'Không được phép bỏ trống tiêu đề' })
  @MaxLength(100, { message: 'Độ dài tiêu đề tối đa là 100 kí tự' })
  title: string;

  @IsDefined({ message: 'Không được phép để trống tác giả' })
  @IsUUID('4', { message: 'Mã tác giả sai định dạng' })
  authorId: string;

  @IsDefined({ message: 'Không được phép để trống tên nhà xuất bản' })
  @IsUUID('4', { message: 'Mã nhà xuất bản sai định dạng' })
  publisherId: string;

  @IsDefined({ message: 'Không được phép để trống tên danh mục sách' })
  @IsUUID('4', { message: 'Mã thể loại sai định dạng' })
  categoryId: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Giá sách phải là số' })
  price: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Số lượng sách phải là số' })
  stock: number;

  @IsOptional()
  @IsArray({ message: 'Danh sách ảnh phải là mảng' })
  @ArrayMaxSize(8, { message: 'Tối đa 8 ảnh cho mỗi sách' })
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { each: true, message: 'Link ảnh không đúng định dạng URL' },
  )
  images?: string[];

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() === '' ? undefined : value,
  )
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Thumbnail phải là URL hợp lệ' },
  )
  thumbnail?: string;
}
