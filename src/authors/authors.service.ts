import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { AuthorResponse } from './dto/authorResponse';
import { ApiRes } from 'src/response/response.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    try {
      let authorName = await this.authorRepository.findOne({
        where: {
          firstname: createAuthorDto.firstname,
          lastname: createAuthorDto.lastname,
        },
      });
      if (authorName) {
        throw new BadRequestException('Tác giả đã tồn tại');
      }
      authorName = await this.authorRepository.save(createAuthorDto);
      return ApiRes.created('Thêm tác giả thành công', authorName);
    } catch (error) {
      if (error instanceof BadRequestException) {
        return ApiRes.badRequest(error.message, 'Thất bại');
      }
      return ApiRes.error('Thêm tác giả thất bại', 'Thất bại');
    }
  }

  async findAll() {
    try {
      const authors = await this.authorRepository.find();

      return ApiRes.success(
        'Danh sách tác giả',
        authors.map(
          (author) => new AuthorResponse(author.firstname, author.lastname),
        ),
      );
    } catch (error) {
      return ApiRes.error('Không thể lấy danh sách tác giả', '');
    }
  }

  async findOne(id: string) {
    try {
      const author: Author[] = await this.authorRepository
        .createQueryBuilder('author')
        .where('author.firstName like :name', { name: '%' + id + '%' })
        .getMany();
      if (author.length === 0) {
        throw new NotFoundException('Không tìm thấy tác giả');
      }
      return ApiRes.success('Tìm tác giả thành công', author);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiRes.notFound(error.message, '');
      }
      return ApiRes.error('Không thể tìm kiếm tác giả', '');
    }
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    try {
      await this.authorRepository.update(id, updateAuthorDto);
      return ApiRes.success('Cập nhật tác giả thành công', '');
    } catch (error) {
      return ApiRes.error('Không thể cập nhật tác giả', '');
    }
  }

  async remove(id: number) {
    try {
      await this.authorRepository.delete(id);
      return ApiRes.success('Xóa tác giả thành công', '');
    } catch (error) {
      return ApiRes.error('Không thể xóa tác giả', '');
    }
  }
}
