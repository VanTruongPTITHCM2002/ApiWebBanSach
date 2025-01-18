import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';
import { AuthorResponse } from './dto/authorResponse';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    try {
      const authorName = await this.authorRepository.findOne({
        where: {
          firstname: createAuthorDto.firstname,
          lastname: createAuthorDto.lastname,
        },
      });
      if (authorName) {
        throw new HttpException('Tác giả đã tồn tại', HttpStatus.BAD_REQUEST);
      }
      const author = await this.authorRepository.save(createAuthorDto);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.CREATED)
        .message('Thêm tác giả thành công')
        .data(author)
        .build();
    } catch (error) {
      if (error instanceof HttpException) {
        return Builder<ApiResponse<any>>()
          .statusCode(error.getStatus())
          .message(error.message)
          .build();
      }
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Lỗi từ cơ sở dữ liệu...')
        .data('')
        .build();
    }
  }

  async findAll() {
    try {
      const authors = await this.authorRepository.find();
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Danh sách tác giả')
        .data(
          authors.map(
            (author) => new AuthorResponse(author.firstname, author.lastname),
          ),
        )
        .build();
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể lấy danh sách tác giả')
        .data('')
        .build();
    }
  }

  async findOne(id: string) {
    try {
      const author: Author[] = await this.authorRepository
        .createQueryBuilder('author')
        .where('author.firstName like :name', { name: '%' + id + '%' })
        .getMany();
      if (author.length === 0) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message('Không tìm thấy tác giả này')
          .build();
      }
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.OK)
        .message('Tìm thành công tác giả')
        .data(author)
        .build();
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể tìm kiếm tác giả')
        .build();
    }
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
