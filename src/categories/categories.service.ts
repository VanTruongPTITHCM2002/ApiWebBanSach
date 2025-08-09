import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ApiRes } from 'src/response/response.dto';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const isExist = await this.categoryRepository.findOne({
        where: { categoryName: createCategoryDto.categoryName },
      });
      if (isExist) {
        this.logger.error('Danh mục đã tồn tại');
        throw new BadRequestException('Danh mục đã tồn tại');
      }
      await this.categoryRepository.save(createCategoryDto, {
        transaction: true,
      });
      this.logger.log('Thêm danh mục thành công');
      return ApiRes.created('Thêm danh mục thành công', 'Thành công');
    } catch (error) {
      this.logger.error('Không thể thêm danh mục');
      return ApiRes.error('Không thể thêm danh mục', 'Thất bại');
    }
  }

  async findAll(page: number, size: number) {
    try {
      const categories = await this.categoryRepository
        .createQueryBuilder('category')
        .loadRelationCountAndMap('category.bookCount', 'category.books')
        .skip((page - 1) * size)
        .take(size)
        .getMany();
      return ApiRes.success('Danh sách danh mục của sách', categories);
    } catch (error) {
      console.log(error);
      return ApiRes.error('Không thể lấy danh sách danh mục', 'Thất bại');
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { categoryId: id },
      });
      if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục');
      }
      const books = await this.bookRepository.find({
        where: { category: { categoryId: id } },
      });

      const result = books.map((book) => ({
        ...book,
        image: undefined,
        imageBase64: book.image
          ? `data:image/jpeg;base64,${book.image.toString('base64')}`
          : null,
      }));
      return ApiRes.success('Tìm thấy danh mục', result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiRes.notFound('Không tìm thấy danh mục', 'Thất bại');
      }
      return ApiRes.error('Không thể tìm danh mục', 'Thất bại');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update(id, updateCategoryDto);
      return ApiRes.success('Cập nhật danh mục thành công', 'Thành công');
    } catch (error) {
      return ApiRes.error('Không thể cập nhật danh mục', 'Thất bại');
    }
  }

  async remove(id: number) {
    try {
      const listBookByCategory = await this.bookRepository.find({
        where: { category: { categoryId: id } },
      });
      if (listBookByCategory.length > 0) {
        throw new BadRequestException('Danh mục này đang chứa sách');
      }
      await this.categoryRepository.delete(id);
      return ApiRes.success('Xóa danh mục thành công', 'Thành công');
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return ApiRes.badRequest(error.message, 'Thất bại');
      }
      return ApiRes.error(error.message, 'Thất bại');
    }
  }
}
