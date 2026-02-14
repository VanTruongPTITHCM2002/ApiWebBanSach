import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { FilterBookQueryDto } from './dto/filter-book-query.dto';
import { Author } from '@/authors/entities/author.entity';
import { Publisher } from '@/publishers/entities/publisher.entity';
import { Category } from '@/categories/entities/category.entity';
import { BaseService } from '@/common/services/base.service';
import { ApiRes } from '@/response/response.dto';
import { BaseFilterDto } from '@/request/base-filter.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { MessageError } from '@/enum/message.error.enum';

@Injectable()
export class BooksService extends BaseService<Book> {
  private log: Logger = new Logger(BooksService.name);
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,

    @InjectRepository(Publisher)
    private readonly publisherRepository: Repository<Publisher>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(bookRepository, 'book');
  }

  async create(createBookDto: CreateBookDto) {
    try {
      this.log.log('Đang trong quá trình thêm sách...');
      const [author, publisher, category] = await Promise.all([
        this.validateAuthor(createBookDto.authorId),
        this.validatePublisher(createBookDto.publisherId),
        this.validateCategory(createBookDto.categoryId),
      ]);

      const book = {
        title: createBookDto.title,
        price: createBookDto.price,
        stock: createBookDto.stock,
        thumbnail: createBookDto.thumbnail,
        authorId: author,
        category: category,
        publisher: publisher,
        isDeleted: false,
        status: true,
        images: [...new Set(createBookDto.images)],
        createdAt: new Date(),
      };
      this.log.debug('Đang trong quá trình thêm xuống database');
      const saveBook = await this.bookRepository.save(book);
      this.log.log(`Tạo sách thành công với id: ${saveBook.bookid}`);
      return ApiRes.success(
        `Thêm sách ${createBookDto.title} thành công`,
        saveBook,
      );
    } catch (error: any) {
      console.error(error.message);
      this.log.error(`Xảy ra lỗi trong quá trình thêm ${error}`);
      if (error instanceof NotFoundException) {
        return ApiRes.notFound(error.message);
      }
      throw new HttpException(
        'Đã có lỗi xảy ra',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      this.log.log('Kết thúc quá trình tạo sách');
    }
  }

  private async validateAuthor(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id: id },
    });
    if (!author) {
      throw new NotFoundException(`Không tìm thấy tác giả`);
    }
    return author;
  }

  private async validateCategory(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: id },
    });
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục`);
    }
    return category;
  }

  private async validatePublisher(id: string) {
    const publisher = await this.publisherRepository.findOne({
      where: { publisherId: id },
    });
    if (!publisher) {
      throw new NotFoundException(`Không tìm thấy nhà xuất bản`);
    }
    return publisher;
  }

  async findWithoutFilter(page: number, size: number) {
    try {
      const [books, totalElements] = await this.bookRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        where: {
          isDeleted: false,
        },
        relations: ['authorId', 'category', 'publisherId'],
      });

      const totalPages = Math.ceil(totalElements / size);
      const booksWithBase64 = books.map((book) => {
        let imagesBase64 = null;

        if (book.images && book.images instanceof Buffer) {
          imagesBase64 = `data:images/jpeg;base64,${book.images.toString('base64')}`;
        }

        return {
          bookid: book.bookid,
          title: book.title,
          isDeleted: book.isDeleted,
          price: book.price,
          stock: book.stock,
          status: book.status,
          imagesBase64,
          authorName: `${book.authorId.firstname} ${book.authorId.lastname}`,
          categoryName: book.category.categoryName,
          publisherName: book.publisher.publisherName,
        };
      });

      return ApiRes.success('Hiện danh sách sách thành công', {
        content: booksWithBase64,
        page,
        size,
        totalElements,
        totalPages,
        first: page === 1,
        last: page >= totalPages,
      });
    } catch (error) {
      console.error(error.message);
      throw new HttpException(
        'Không thể hiện danh sách sách',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      // return ApiRes.internalServerError('Không thể hiện danh sách sách');
    }
  }

  // book.service.ts
  async findAllWithBase64(query: BaseFilterDto): Promise<ApiRes<any>> {
    const paginated = await super.findAll(query);

    // convert images sang base64
    const paginatedWithBase64 = {
      ...paginated,
      items: paginated.items.map((book) => {
        let imagesBase64 = null;
        if (book.images && book.images instanceof Buffer) {
          imagesBase64 = `data:images/jpeg;base64,${book.images.toString('base64')}`;
        }
        return {
          ...book,
          authorName: book.authorId.firstname + ' ' + book.authorId.lastname,
          categoryName: book.category.categoryName,
          publisherName: book.publisher.publisherName,
          imagesBase64,
        };
      }),
    };

    return ApiRes.success(
      'Hiện danh sách sách thành công',
      paginatedWithBase64,
    );
  }

  async filter(page: number, size: number, filters: FilterBookQueryDto) {
    try {
      page = Number(page);
      size = Number(size);

      const where: any = { isDeleted: false };

      if (filters) {
        const status =
          filters.status !== undefined && filters.status !== ''
            ? filters.status === 'true' || filters.status === true
            : null;
        const minPrice = filters.minPrice ? Number(filters.minPrice) : null;
        const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : null;

        if (filters.title) {
          where.title = ILike(`%${filters.title}%`);
        }

        if (status !== null) {
          where.status = status;
        }

        if (filters.stock) {
          where.stock = Number(filters.stock);
        }

        if (minPrice != null && maxPrice != null) {
          where.price = Between(minPrice, maxPrice);
        } else if (minPrice != null) {
          where.price = MoreThanOrEqual(minPrice);
        } else if (maxPrice != null) {
          where.price = LessThanOrEqual(maxPrice);
        }

        if (filters.categoryId) {
          where.category = { categoryId: Number(filters.categoryId) };
        }

        if (filters.authorId) {
          where['authorId'] = Number(filters.authorId);
        }

        if (filters.publisherId) {
          where.publisher = { publisherId: Number(filters.publisherId) };
        }
      }

      const [books, totalElements] = await this.bookRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        where,
        relations: ['authorId', 'category', 'publisher'],
      });

      const totalPages = Math.ceil(totalElements / size);

      const booksPaginate = books.map((book) => {
        return {
          bookid: book.bookid,
          title: book.title,
          isDeleted: book.isDeleted,
          price: book.price,
          stock: book.stock,
          status: book.status,
          images: book.images,
          thumbnail: book.thumbnail,
          authorName: book.authorId.firstname + ' ' + book.authorId.lastname,
          categoryName: book.category.categoryName,
          publisherName: book.publisher.publisherName,
        };
      });

      return ApiRes.success('Hiện danh sách sách thành công', {
        content: booksPaginate,
        page,
        size,
        totalElements,
        totalPages,
        first: page === 1,
        last: page >= totalPages,
        filters,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Không thể hiện danh sách sách',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const book = await this.bookRepository.findOne({
        where: { bookid: id },
        relations: ['authorId', 'publisher', 'category'],
      });

      let imagesBase64 = null;

      if (book.images && book.images instanceof Buffer) {
        imagesBase64 = `data:images/jpeg;base64,${book.images.toString('base64')}`;
      }

      return ApiRes.success('Hiện thông tin sách thành công', {
        bookid: book.bookid,
        title: book.title,
        isDeleted: book.isDeleted,
        price: book.price,
        stock: book.stock,
        status: book.status,
        imagesBase64,
        authorId: book.authorId.id,
        authorName: book.authorId.firstname + ' ' + book.authorId.lastname,
        categoryName: book.category.categoryName,
        categoryId: book.category.categoryId,
        publisherName: book.publisher.publisherName,
        publisherId: book.publisher.publisherId,
        thumbnail: book.thumbnail,
        images: book.images,
      });
    } catch (error) {
      console.log(error.message);
      throw new HttpException(
        'Không thể hiện thông tin của sách',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBookByBuy() {
    try {
      const books = await this.bookRepository
        .createQueryBuilder('book')
        .leftJoin('book.orderdetails', 'detail')
        .leftJoin('detail.orderId', 'order')
        .where('order.workflowStatus = :status', { status: 1 })
        .select(['book', 'COUNT(*) AS order_count'])
        .groupBy('book.bookid')
        .getMany();
      this.log.log('Lấy thành công danh sách sách mua nhiều nhất');
      return ApiRes.success(
        'Lấy thành công danh sách sách mua nhiều nhất',
        books,
      );
    } catch (error: any) {
      console.log(error.message);
      this.log.error('Không thể hiện danh sách sách mua nhiều nhất');
      ApiRes.error('Không thể hiện danh sách sách mua nhiều nhất', 'Thất bại');
    }
  }

  async getBooksByReviews() {
    try {
      const books = await this.bookRepository
        .createQueryBuilder('book')
        .leftJoin('book.reviewBook', 'review')
        .andWhere('review.rating = :rating', { rating: 5 })
        .select(['book', 'Count(*) as review_count'])
        .groupBy('book.bookid')
        .having('Count(*) >:minCount', { minCount: 5 })
        .getMany();
      this.log.log('Lấy thành công danh sách sách được đánh giá cao');
      return ApiRes.success(
        'Lấy thành công danh sách được đánh giá cao',
        books,
      );
    } catch (error) {
      this.log.error('Không thể lấy danh sách sách được đánh giá cao');
      console.log(error.message);
      return ApiRes.error(
        'Không thể lấy danh sách sách được đánh giá cao',
        'Thất bại',
      );
    }
  }

  async getBookByName(bookName: string) {
    try {
      const book = await this.bookRepository.findBy({
        title: ILike(`%${bookName}%`),
      });
      this.log.log('Tìm kiếm sách thành công theo tên');
      return ApiRes.success('Tìm kiếm thành công sách theo tên', book);
    } catch (error: any) {
      console.log(error.message);
      this.log.error('Tìm kiếm sách thất bại');
      return ApiRes.error('Tìm kiếm sách thất bại', 'Thất bại');
    }
  }

  async update(id: string, updateBookDto: UpdateBookDto) {
    try {
      const [author, publisher, category] = await Promise.all([
        this.validateAuthor(updateBookDto.authorId),
        this.validatePublisher(updateBookDto.publisherId),
        this.validateCategory(updateBookDto.categoryId),
      ]);

      await this.bookRepository.update(id, {
        title: updateBookDto.title,
        authorId: { id: author.id },
        category: { categoryId: category.categoryId },
        publisher: { publisherId: publisher.publisherId },
        price: updateBookDto.price,
        stock: updateBookDto.stock,
        images: [...new Set(updateBookDto.images)],
        thumbnail: updateBookDto.thumbnail,
        updatedAt: new Date(),
      });
      return ApiRes.success('Cập nhật sách thành công');
    } catch (error) {
      console.log(error.message);
      return ApiRes.error('Không thể cập nhật sách');
    }
  }

  async remove(id: string) {
    try {
      const book = await this.bookRepository.findOne({
        where: { bookid: id },
      });
      if (!book) {
        return ApiRes.notFound('Không tìm thấy sách');
      }

      book.isDeleted = true;
      await this.bookRepository.save(book);

      return ApiRes.success('Xóa sách thành công');
    } catch (error) {
      return ApiRes.error('Không thể xóa sách');
    }
  }

  async getBookSearchSuggestions(name: string) {
    try {
      const books = await this.bookRepository.find({
        where: {
          title: ILike(`%${name}%`),
        },
        // take: 5,
      });
      const suggestions = books.map((book) => book.title);

      return ApiRes.success('Lấy gợi ý tìm kiếm thành công', suggestions);
    } catch (error) {
      return ApiRes.internalServerError(MessageError.INTERNAL_SERVER_ERROR);
    } finally {
    }
  }

  async getActiveBooks() {
    try {
      const books = await this.bookRepository.find({
        where: {
          isDeleted: true,
        },
      });

      return ApiRes.success(
        'Lấy thành công số lượng sách chưa xóa',
        books.length,
      );
    } catch (error) {
      console.error(error.message);
      return ApiRes.internalServerError(MessageError.INTERNAL_SERVER_ERROR);
    }
  }
}
