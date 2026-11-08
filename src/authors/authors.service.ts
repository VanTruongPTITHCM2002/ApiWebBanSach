import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { ApiRes } from '@/response/response.dto';
import { FilterAuthorQueryDto } from './dto/filter-author-query-dto';
import { AuthorsRepository } from './repositories/authors.repository';
import { AuthorMapper } from './mappers/author.mapper';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly authorRepository: AuthorsRepository,
    private readonly authorMapper: AuthorMapper,
  ) {}

  async create(createAuthorDto: CreateAuthorDto) {
    const authorName = await this.authorRepository.findByName(
      createAuthorDto.firstname,
      createAuthorDto.lastname,
    );

    if (authorName) {
      throw new BadRequestException('Tác giả đã tồn tại');
    }

    const author = await this.authorRepository.create(createAuthorDto);

    return ApiRes.created('Thêm tác giả thành công', author);
  }

  async findAll(page: number, size: number, filters: FilterAuthorQueryDto) {
    const result = await this.authorRepository.findPage(page, size, filters);
    return ApiRes.success('Danh sách tác giả', result);
  }

  async findOne(id: string) {
    const authors = await this.authorRepository.findByNameContaining(id);

    if (authors.length === 0) {
      throw new NotFoundException('Không tìm thấy tác giả');
    }

    return ApiRes.success('Tìm tác giả thành công', authors);
  }

  async findOneAuthorManyBook(authorName: string) {
    const author =
      await this.authorRepository.findByLastNameWithBooks(authorName);

    if (!author) {
      throw new BadRequestException('Tác giả không tồn tại');
    }

    return ApiRes.success('Lấy sách của tác giả thành công', author);
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    await this.authorRepository.updateById(id, updateAuthorDto);
    return ApiRes.success('Cập nhật tác giả thành công');
  }

  async remove(id: string) {
    const author = await this.authorRepository.findByIdWithBooks(id);

    if (!author) {
      throw new NotFoundException('Không tìm thấy tác giả');
    }

    if (author.books?.length > 0) {
      throw new BadRequestException('Không thể xóa tác giả');
    }

    await this.authorRepository.deleteById(id);
    return ApiRes.success('Xóa tác giả thành công');
  }

  async selectInfinityAuthor() {
    const authors = await this.authorRepository.findActive();

    const selectAuthors = authors.map((author) =>
      this.authorMapper.toOption(author),
    );

    return ApiRes.success('Lấy danh sách tác giả thành công', selectAuthors);
  }
}
