import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiRes } from '@/response/response.dto';
import { CategoriesRepository } from './repositories/categories.repository';
import { BooksRepository } from '@/books/repositories/books.repository';
import { CategoryMapper } from './mappers/category.mapper';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  constructor(
    private readonly categoryRepository: CategoriesRepository,
    private readonly bookRepository: BooksRepository,
    private readonly categoryMapper: CategoryMapper,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const isExist = await this.categoryRepository.findByName(
      createCategoryDto.categoryName,
    );

    if (isExist) {
      this.logger.error('Danh mục đã tồn tại');
      throw new BadRequestException('Danh mục đã tồn tại');
    }

    await this.categoryRepository.create(createCategoryDto);
    this.logger.log('Thêm danh mục thành công');
    return ApiRes.created('Thêm danh mục thành công', 'Thành công');
  }

  async findAll(page: number, size: number, search?: string) {
    const result = await this.categoryRepository.findPageWithBookCount(
      page,
      size,
      search,
    );

    return ApiRes.success('Danh sách danh mục', result);
  }

  async findAllNotPaginate() {
    const categories = await this.categoryRepository.findMany();
    const categoriesResponse = categories.map((category) =>
      this.categoryMapper.toSelectResponse(category),
    );

    return ApiRes.success('Get Categories successfully', categoriesResponse);
  }

  async findOne(
    id: string,
    page?: number,
    size?: number,
    sort?: string,
    idPublisher?: string,
    minPrice?: string,
    maxPrice?: string,
  ) {
    const category = await this.categoryRepository.findByIdOrCode(id);

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    const books = await this.bookRepository.findPageByCategory(
      category.categoryId,
      {
        page,
        size,
        sort,
        publisherId: idPublisher,
        minPrice,
        maxPrice,
      },
    );

    const content = books.content.map((book) =>
      this.categoryMapper.toBookItem(book),
    );

    return ApiRes.success('Tìm thấy danh mục', {
      ...books,
      content,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.updateById(id, updateCategoryDto);
    return ApiRes.success('Cập nhật danh mục thành công', 'Thành công');
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findByIdOrCode(id);

    if (!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    const bookCount = await this.bookRepository.countByCategory(
      category.categoryId,
    );

    if (bookCount > 0) {
      throw new BadRequestException('Danh mục này đang chứa sách');
    }

    await this.categoryRepository.deleteById(category.categoryId);
    return ApiRes.success('Xóa danh mục thành công', 'Thành công');
  }

  async selectInfinityCategories() {
    const categories = await this.categoryRepository.findActive();

    const selectCategories = categories.map((category) =>
      this.categoryMapper.toOption(category),
    );

    return ApiRes.success(
      'Lấy thành công danh sách thể loại',
      selectCategories,
    );
  }
}
