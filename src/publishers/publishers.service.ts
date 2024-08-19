import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publisher } from './entities/publisher.entity';
import { Repository } from 'typeorm';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,
  ) {}
  async create(createPublisherDto: CreatePublisherDto) {
    try {
      await this.publisherRepository.save(createPublisherDto);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện thêm nhà xuất bản')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.CREATED)
      .message('Thêm nhà xuất bản thành công')
      .data('')
      .build();
  }

  async findAll() {
    let publishers = [];
    try {
      publishers = await this.publisherRepository.find();
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể lấy danh sách nhà xuất bản')
        .data(publishers)
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Danh sách nhả xuất bản')
      .data(publishers)
      .build();
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
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện cập nhật nhà xuất bản')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Cập nhật thành công nhà xuất bản')
      .data('')
      .build();
  }

  async remove(id: number) {
    try {
      await this.publisherRepository.delete(id);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện xóa nhà xuất bản')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Xóa thành công nhà xuất bản')
      .data('')
      .build();
  }
}
