import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FilterBookQueryDto } from './dto/filter-book-query.dto';
import { ApiRes } from '@/response/response.dto';
import { BaseFilterDto } from '@/request/base-filter.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BooksRepository } from './repositories/books.repository';
import { AuthorsRepository } from '@/authors/repositories/authors.repository';
import { PublishersRepository } from '@/publishers/repositories/publishers.repository';
import { CategoriesRepository } from '@/categories/repositories/categories.repository';
import { BookMapper } from './mappers/book.mapper';
import { mapPaginationItems } from '@/common/mappers/page.mapper';

@Injectable()
export class BooksService {
  private log: Logger = new Logger(BooksService.name);
  constructor(
    private readonly bookRepository: BooksRepository,
    private readonly authorRepository: AuthorsRepository,
    private readonly publisherRepository: PublishersRepository,
    private readonly categoryRepository: CategoriesRepository,
    private readonly bookMapper: BookMapper,
  ) {}

  async create(createBookDto: CreateBookDto) {
    this.log.log('Đang trong quá trình thêm sách...');
    await Promise.all([
      this.validateAuthor(createBookDto.authorId),
      this.validatePublisher(createBookDto.publisherId),
      this.validateCategory(createBookDto.categoryId),
    ]);

    this.log.debug('Đang trong quá trình thêm xuống database');
    const saveBook = await this.bookRepository.createBook(createBookDto);
    this.log.log(`Tạo sách thành công: ${saveBook.sku} (${saveBook.bookid})`);

    return ApiRes.success(
      `Thêm sách ${createBookDto.title} thành công`,
      saveBook,
    );
  }

  private async validateAuthor(id: string) {
    const author = await this.authorRepository.findById(id);
    if (!author) {
      throw new NotFoundException(`Không tìm thấy tác giả`);
    }
    return author;
  }

  private async validateCategory(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục`);
    }
    return category;
  }

  private async validatePublisher(id: string) {
    const publisher = await this.publisherRepository.findById(id);
    if (!publisher) {
      throw new NotFoundException(`Không tìm thấy nhà xuất bản`);
    }
    return publisher;
  }

  async findWithoutFilter(page: number, size: number) {
    const result = await this.bookRepository.findPageWithoutFilter(page, size);

    return ApiRes.success('Hiện danh sách sách thành công', {
      ...result,
      content: result.content.map((book) => this.bookMapper.toListItem(book)),
    });
  }

  async findAllWithBase64(query: BaseFilterDto): Promise<ApiRes<any>> {
    const paginated = await this.bookRepository.findPageWithBaseFilter(query);

    const paginatedWithBase64 = mapPaginationItems(paginated, (book) =>
      this.bookMapper.toBase64Item(book),
    );

    return ApiRes.success(
      'Hiện danh sách sách thành công',
      paginatedWithBase64,
    );
  }

  async filter(page: number, size: number, filters: FilterBookQueryDto) {
    page = Number(page);
    size = Number(size);

    const result = await this.bookRepository.findPageWithFilter(
      page,
      size,
      filters,
    );

    const content = result.content.map((book) =>
      this.bookMapper.toFilterItem(book),
    );

    return ApiRes.success('Hiện danh sách sách thành công', {
      ...result,
      content,
      filters,
    });
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findByIdOrSku(id);

    if (!book) {
      throw new NotFoundException('Không tìm thấy sách');
    }

    return ApiRes.success(
      'Hiện thông tin sách thành công',
      this.bookMapper.toResponse(book),
    );
  }

  async getBookByBuy() {
    const books = await this.bookRepository.findBestSellers();
    this.log.log('Lấy thành công danh sách sách mua nhiều nhất');
    return ApiRes.success(
      'Lấy thành công danh sách sách mua nhiều nhất',
      books,
    );
  }

  async getBooksByReviews() {
    const books = await this.bookRepository.findTopRated();
    this.log.log('Lấy thành công danh sách sách được đánh giá cao');
    return ApiRes.success('Lấy thành công danh sách được đánh giá cao', books);
  }

  async getBookByName(bookName: string) {
    const book = await this.bookRepository.searchByTitle(bookName);
    this.log.log('Tìm kiếm sách thành công theo tên');
    return ApiRes.success('Tìm kiếm thành công sách theo tên', book);
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    await Promise.all([
      this.validateAuthor(updateBookDto.authorId),
      this.validatePublisher(updateBookDto.publisherId),
      this.validateCategory(updateBookDto.categoryId),
    ]);

    await this.bookRepository.updateBook(id, updateBookDto);
    return ApiRes.success('Cập nhật sách thành công');
  }

  async remove(id: string) {
    const deleted = await this.bookRepository.markDeleted(id);

    if (!deleted) {
      throw new NotFoundException('Không tìm thấy sách');
    }

    return ApiRes.success('Xóa sách thành công');
  }

  async getBookSearchSuggestions(name: string) {
    const books = await this.bookRepository.searchByTitle(name);
    const suggestions = books.map((book) => book.title);

    return ApiRes.success('Lấy gợi ý tìm kiếm thành công', suggestions);
  }

  async getActiveBooks() {
    const total = await this.bookRepository.countActiveBooks();
    return ApiRes.success('Lấy thành công số lượng sách chưa xóa', total);
  }
}
