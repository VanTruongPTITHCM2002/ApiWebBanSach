import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { ILike, Repository } from 'typeorm';
import { ApiRes } from '@/response/response.dto';
import { FilterAuthorQueryDto } from './dto/filter-author-query-dto';

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
      if (authorName) return ApiRes.badRequest('Tác giả đã tồn tại');

      authorName = await this.authorRepository.save(createAuthorDto);

      return ApiRes.created('Thêm tác giả thành công', authorName);
    } catch (error) {
      return ApiRes.internalServerError('Thêm tác giả thất bại');
    }
  }

  async findAll(page: number, size: number, filters: FilterAuthorQueryDto) {
    const skip = (page - 1) * size;
    const take = size;
    let where: any = {};

    if (filters) {
      if (filters.search) {
        where = [
          { firstname: ILike(`%${filters.search}%`) },
          { lastname: ILike(`%${filters.search}%`) },
          { country: ILike(`%${filters.search}%`) },
        ];
      }
    }

    try {
      const [authors, totalElements] = await this.authorRepository.findAndCount(
        {
          skip,
          take,
          where,
        },
      );

      const totalPages = Math.ceil(totalElements / size);
      return ApiRes.success('Danh sách tác giả', {
        content: authors,
        page,
        size,
        totalElements,
        totalPages,
        first: page === 1,
        last: page >= totalPages,
      });
    } catch (error) {
      console.log(error.message);
      return ApiRes.error('Lấy danh sách tác giả thất bại');
    }
  }

  async findOne(id: string) {
    try {
      const author: Author[] = await this.authorRepository
        .createQueryBuilder('author')
        .where('author.firstName like :name', { name: '%' + id + '%' })
        .getMany();
      if (author.length === 0) return ApiRes.notFound('Không tìm thấy tác giả');

      return ApiRes.success('Tìm tác giả thành công', author);
    } catch (error) {
      console.log(error.message);
      return ApiRes.error('Không thể tìm kiếm tác giả');
    }
  }

  async findOneAuthorManyBook(authorName: string) {
    const author = await this.authorRepository.findOne({
      where: {
        lastname: authorName,
      },
      relations: ['books'],
    });

    if (!author) return ApiRes.badRequest('Tác giả không tồn tại');

    return ApiRes.success('Lấy sách của tác giả thành công', author);
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    try {
      await this.authorRepository.update(id, updateAuthorDto);
      return ApiRes.success('Cập nhật tác giả thành công');
    } catch (error) {
      console.log(error.message);
      return ApiRes.error('Không thể cập nhật tác giả');
    }
  }

  async remove(id: number) {
    try {
      const author = await this.authorRepository.findOne({
        where: { authorId: id },
      });

      if (!author) return ApiRes.notFound('Không tìm thấy tác giả');

      if (author.books?.length > 0) {
        return ApiRes.badRequest('Không thể xóa tác giả');
      }

      await this.authorRepository.delete(id);
      return ApiRes.success('Xóa tác giả thành công');
    } catch (error) {
      return ApiRes.error('Không thể xóa tác giả');
    }
  }
}
