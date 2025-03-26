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

  async findAll() {
    try {
      const categories = await this.categoryRepository.find();
      this.logger.log('Lấy danh sách danh mục thành công');
      return ApiRes.success('Danh sách danh mục của sách', categories);
    } catch (error) {
      this.logger.error('Không thể lấy danh sách danh mục');
      return ApiRes.error('Không thể lấy danh sách danh mục', 'Thất bại');
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { categoryId: id },
      });
      if (!category) {
        this.logger.error('Không tìm thấy danh mục');
        throw new NotFoundException('Không tìm thấy danh mục');
      }
      const books = await this.bookRepository.find({
        where: { category: { categoryId: id } },
      });
      this.logger.log('Tìm thấy danh mục');
      return ApiRes.success('Tìm thấy danh mục', books);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiRes.notFound('Không tìm thấy danh mục', 'Thất bại');
      }
      this.logger.error('Không thể tìm danh mục');
      return ApiRes.error('Không thể tìm danh mục', 'Thất bại');
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update(id, updateCategoryDto);
      this.logger.log('Cập nhật danh mục thành công');
      return ApiRes.success('Cập nhật danh mục thành công', 'Thành công');
    } catch (error) {
      this.logger.error('Không thể cập nhật danh mục');
      return ApiRes.error('Không thể cập nhật danh mục', 'Thất bại');
    }
  }

  async remove(id: number) {
    try {
      const listBookByCategory = await this.bookRepository.find({
        where: { category: { categoryId: id } },
      });
      if (listBookByCategory.length > 0) {
        this.logger.error('Danh mục này đang chứa sách');
        throw new BadRequestException('Danh mục này đang chứa sách');
      }
      await this.categoryRepository.delete(id);
      this.logger.log('Xóa danh mục thành công');
      return ApiRes.success('Xóa danh mục thành công', 'Thành công');
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        return ApiRes.badRequest(error.message, 'Thất bại');
      }
      this.logger.error('Không thể xóa danh mục');
      return ApiRes.error(error.message, 'Thất bại');
    }
  }
}
