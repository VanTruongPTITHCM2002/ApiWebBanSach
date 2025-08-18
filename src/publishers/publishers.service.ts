import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publisher } from './entities/publisher.entity';
import { Repository } from 'typeorm';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';
import { ApiRes } from 'src/response/response.dto';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {}
  async create(createPublisherDto: CreatePublisherDto) {
    try {
      const publisher = await this.publisherRepository.findOne({
        where: { publisherName: createPublisherDto.publisherName },
      });

      if (publisher) return ApiRes.badRequest('Nhà xuất bản đã tồn tại');
      await this.publisherRepository.save(createPublisherDto);
      return ApiRes.created('Thêm nhà xuất bản thành công');
    } catch (error) {
      console.error(error.message);
      return ApiRes.internalServerError('Xảy ra lỗi trong quá trình thêm');
    }
  }

  async findAll(page: number, size: number) {
    let publishers = [];
    try {
      publishers = await this.publisherRepository.find({
        skip: (page - 1) * size,
        take: size,
      });

      return ApiRes.success(
        'Hiện danh sách nhà xuất bản thành công',
        publishers,
      );
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể lấy danh sách nhà xuất bản')
        .data(publishers)
        .build();
    }
  }

  async findOne(id: number) {
    let publisher: Publisher = null;
    try {
      publisher = await this.publisherRepository.findOne({
        where: { publisherId: id },
      });
      if (!publisher) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message('Không tìm thấy nhà xuất bản')
          .data(publisher)
          .build();
      }
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện tìm kiếm nhà xuất bản')
        .data(publisher)
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Tìm thành công nhà xuất bản')
      .data(publisher)
      .build();
  }

  async update(id: number, updatePublisherDto: UpdatePublisherDto) {
    try {
      await this.publisherRepository.update(id, updatePublisherDto);
      return ApiRes.success('Cập nhật thành công nhà xuất bản');
    } catch (error) {
      console.error(error.message);
      return ApiRes.internalServerError(
        'Có lỗi xảy ra trong quá trình cập nhật',
      );
    }
  }

  async remove(id: number) {
    try {
      const publisher = await this.publisherRepository.findOne({
        where: { publisherId: id },
        relations: ['books'],
      });

      if (!publisher) return ApiRes.notFound('Không tìm thấy nhà xuất bản');

      if (publisher.books?.length > 0)
        return ApiRes.badRequest('Không thể xóa nhà xuất bản');

      await this.publisherRepository.delete(id);
      return ApiRes.success('Xóa thành công nhà xuất bản');
    } catch (error) {
      console.error(error.message);
      return ApiRes.internalServerError('Có lỗi xảy ra trong quá trình xóa');
    }
  }
}
