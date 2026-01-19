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
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Book } from '@/books/entities/book.entity';
import { ApiRes } from '@/response/response.dto';

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

  async findAll(page: number, size: number, search?: string) {
    try {
      const baseQuery = this.categoryRepository.createQueryBuilder('category');

      if (search !== 'undefied' && search !== 'null') {
        baseQuery.where('category.categoryName LIKE :search', {
          search: `%${search}%`,
        });
      }

      const totalElements = await baseQuery.clone().getCount();

      const categories = await baseQuery
        .loadRelationCountAndMap('category.bookCount', 'category.books')
        .skip((page - 1) * size)
        .take(size)
        .getMany();

      const totalPages = Math.ceil(totalElements / size);

      return ApiRes.success('Danh sách danh mục', {
        content: categories,
        page,
        size,
        totalElements,
        totalPages,
        first: page === 1,
        last: page >= totalPages,
      });
    } catch (error) {
      console.log(error);
      return ApiRes.error('Không thể lấy danh sách danh mục', 'Thất bại');
    }
  }

  async findAllNotPaginate() {
    const categories = await this.categoryRepository.find();
    const categoriesResponse = categories.map((category) => {
      return {
        name: category.categoryName,
        categoryId: category.categoryId,
      };
    });

    return ApiRes.success('Get Categories successfully', categoriesResponse);
  }

  async findOne(
    id: string,
    page?: number,
    size?: number,
    sort?: string,
    publisherId?: string,
    minPrice?: string,
    maxPrice?: string,
  ) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { categoryId: id },
      });
      if (!category) {
        throw new NotFoundException('Không tìm thấy danh mục');
      }

      let order = {};

      if (sort) {
        switch (sort) {
          case 'new':
            order = {
              createdAt: 'DESC',
            };
            break;
          case 'min':
            order = {
              price: 'ASC',
            };
            break;
          case 'max':
            order = {
              price: 'DESC',
            };
            break;
        }
      }

      const toNumberOrNull = (v?: string) =>
        v && v !== 'null' ? Number(v) : null;

      const min = toNumberOrNull(minPrice);
      const max = toNumberOrNull(maxPrice);

      let priceCondition = {};

      if (min !== null && max !== null) {
        priceCondition = { price: Between(min, max) };
      } else if (min !== null) {
        priceCondition = { price: MoreThanOrEqual(min) };
      } else if (max !== null) {
        priceCondition = { price: LessThanOrEqual(max) };
      }

      const [books, totalElements] = await this.bookRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        where: {
          category: { categoryId: id },
          ...(publisherId !== null && {
            publisher: { publisherId: publisherId },
          }),
          ...priceCondition,
        },

        relations: ['authorId'],
        order,
      });

      const totalPages = Math.ceil(totalElements / size);

      const result = books.map((book) => ({
        bookid: book.bookid,
        title: book.title,
        price: book.price,
        link: book.link,
        authorName: book.authorId.firstname + ' ' + book.authorId.lastname,
        imageBase64: book.image
          ? `data:image/jpeg;base64,${book.image.toString('base64')}`
          : null,
      }));
      return ApiRes.success('Tìm thấy danh mục', {
        content: result,
        page,
        size,
        totalElements,
        totalPages,
        first: page === 1,
        last: page >= totalPages,
        // filters,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return ApiRes.notFound('Không tìm thấy danh mục', 'Thất bại');
      }
      console.log(error);
      return ApiRes.error('Không thể tìm danh mục', 'Thất bại');
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryRepository.update(id, updateCategoryDto);
      return ApiRes.success('Cập nhật danh mục thành công', 'Thành công');
    } catch (error) {
      return ApiRes.error('Không thể cập nhật danh mục', 'Thất bại');
    }
  }

  async remove(id: string) {
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
