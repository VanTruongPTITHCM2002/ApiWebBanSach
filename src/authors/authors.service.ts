import { Injectable, Logger } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Repository } from 'typeorm';
import { ApiRes } from 'src/response/response.dto';

@Injectable()
export class AuthorsService {
  private log: Logger = new Logger(AuthorsService.name);
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
        this.log.error('Tác giả đã tồn tại');
        return ApiRes.badRequest('Tác giả đã tồn tại', 'Thất bại');
      }

      authorName = await this.authorRepository.save(createAuthorDto);
      this.log.log('Thêm tác giả thành công');

      return ApiRes.created('Thêm tác giả thành công', authorName);
    } catch (error) {
      this.log.error('Thêm tác giả thất bại');
      console.log(error.message);
      return ApiRes.error('Thêm tác giả thất bại', 'Thất bại');
    }
  }

  async findAll(page: number, size: number) {
    const skip = (page - 1) * size;
    const take = size;
    try {
      const authors = await this.authorRepository.findAndCount({
        skip: skip,
        take: take,
      });
      this.log.log('Lấy danh sách tác giả thành công');
      return ApiRes.success('Danh sách tác giả', authors[0]);
    } catch (error) {
      this.log.error('Lấy danh sách tác giả thất bại');
      console.log(error.message);
      return ApiRes.error('Lấy danh sách tác giả thất bại', 'Thất bại');
    }
  }

  async findOne(id: string) {
    try {
      const author: Author[] = await this.authorRepository
        .createQueryBuilder('author')
        .where('author.firstName like :name', { name: '%' + id + '%' })
        .getMany();
      if (author.length === 0) {
        this.log.error('Không tìm thấy tác giả');
        return ApiRes.notFound('Không tìm thấy tác giả', 'Thất bại');
      }
      this.log.log('Tìm tác giả thành công');
      return ApiRes.success('Tìm tác giả thành công', author);
    } catch (error) {
      this.log.error('Không thể tìm kiếm tác giả');
      console.log(error.message);
      return ApiRes.error('Không thể tìm kiếm tác giả', 'Thất bại');
    }
  }

  async findOneAuthorManyBook(authorName: string) {
    const author = await this.authorRepository.findOne({
      where: {
        lastname: authorName,
      },
      relations: ['books'],
    });

    if (!author) {
      this.log.error('Tác giả không tồn tại');
      return ApiRes.badRequest('Tác giả không tồn tại', 'Thất bại');
    }

    return ApiRes.success('Lấy sách của tác giả thành công', author);
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    try {
      await this.authorRepository.update(id, updateAuthorDto);
      this.log.log('Cập nhật tác giả thành công');
      return ApiRes.success('Cập nhật tác giả thành công', '');
    } catch (error) {
      this.log.error('Không thể cập nhật tác giả');
      console.log(error.message);
      return ApiRes.error('Không thể cập nhật tác giả', 'Thất bại');
    }
  }

  async remove(id: number) {
    try {
      await this.authorRepository.delete(id);
      this.log.log('Xóa tác giả thành công');
      return ApiRes.success('Xóa tác giả thành công', '');
    } catch (error) {
      this.log.error('Không thể xóa tác giả');
      console.log(error.message);
      return ApiRes.error('Không thể xóa tác giả', '');
    }
  }
}
