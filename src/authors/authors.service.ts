import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    let author: Author = null;
    try {
      author = await this.authorRepository.create(createAuthorDto);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thêm tác giả')
        .data(author)
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.CREATED)
      .message('Thêm tác giả thành công')
      .data(author)
      .build();
  }

  async findAll() {
    let authors = [];
    try {
      authors = await this.authorRepository.find();
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể lấy danh sách tác giả')
        .data(authors)
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Danh sách tác giả')
      .data(authors)
      .build();
  }

  async findOne(id: number) {
    let author: Author = null;
    try {
      author = await this.authorRepository.findOne({
        where: { authorId: id },
      });
      if (!author) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message('Không tìm thấy tác giả này')
          .data(author)
          .build();
      }
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể tìm kiếm tác giả')
        .data(author)
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Tìm thành công tác giả')
      .data(author)
      .build();
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    try {
      await this.authorRepository.update(id, updateAuthorDto);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể cập nhật tác giả')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Cập nhật tác giả thành công')
      .data('')
      .build();
  }

  async remove(id: number) {
    try {
      await this.authorRepository.delete(id);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện xóa tác giả')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Xóa tác giả thành công')
      .data('')
      .build();
  }
}
