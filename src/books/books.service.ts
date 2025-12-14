import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
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

  async create(createBookDto: CreateBookDto, file: Express.Multer.File) {
    try {
      const [author, publisher, category] = await Promise.all([
        this.authorRepository
          .createQueryBuilder('author')
          .where("CONCAT(author.firstname, ' ', author.lastname) = :fullname", {
            fullname: createBookDto.authorName,
          })
          .getOne(),
        this.publisherRepository.findOne({
          where: { publisherName: createBookDto.publisherName.toString() },
        }),
        this.categoryRepository.findOne({
          where: { categoryName: createBookDto.categoryName.toString() },
        }),
      ]);

      if (!author || !publisher || !category)
        return ApiRes.notFound(
          `Không tìm thấy: ${
            !author ? 'Tác giả ' : ''
          }${!publisher ? 'Nhà xuất bản ' : ''}${!category ? 'Thể loại ' : ''}`,
        );

      const book = {
        title: createBookDto.title,
        authorId: author,
        category: category,
        publisherId: publisher,
        price: createBookDto.price,
        stock: createBookDto.stock,
        isDeleted: false,
        status: true,
        image: file?.buffer,
      };
      await this.bookRepository.save(book);
      return ApiRes.success('Thêm sách thành công');
    } catch (error) {
      console.log(error.message);
      return ApiRes.error('Không thể thêm sách');
    }
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
        let imageBase64 = null;

        if (book.image && book.image instanceof Buffer) {
          imageBase64 = `data:image/jpeg;base64,${book.image.toString('base64')}`;
        }

        return {
          bookid: book.bookid,
          title: book.title,
          isDeleted: book.isDeleted,
          price: book.price,
          stock: book.stock,
          status: book.status,
          imageBase64,
          link: book.link,
          authorName: `${book.authorId.firstname} ${book.authorId.lastname}`,
          categoryName: book.category.categoryName,
          publisherName: book.publisherId.publisherName,
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

    // convert image sang base64
    const paginatedWithBase64 = {
      ...paginated,
      items: paginated.items.map((book) => {
        let imageBase64 = null;
        if (book.image && book.image instanceof Buffer) {
          imageBase64 = `data:image/jpeg;base64,${book.image.toString('base64')}`;
        }
        return {
          ...book,
          authorName: book.authorId.firstname + ' ' + book.authorId.lastname,
          categoryName: book.category.categoryName,
          publisherName: book.publisherId.publisherName,
          imageBase64,
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
          where.authorId = { authorId: Number(filters.authorId) };
        }

        if (filters.publisherId) {
          where.publisherId = { publisherId: Number(filters.publisherId) };
        }
      }

      const [books, totalElements] = await this.bookRepository.findAndCount({
        skip: (page - 1) * size,
        take: size,
        where,
        relations: ['authorId', 'category', 'publisherId'],
      });

      const totalPages = Math.ceil(totalElements / size);

      const booksWithBase64 = books.map((book) => {
        let imageBase64 = null;

        if (book.image && book.image instanceof Buffer) {
          imageBase64 = `data:image/jpeg;base64,${book.image.toString('base64')}`;
        }

        return {
          bookid: book.bookid,
          title: book.title,
          isDeleted: book.isDeleted,
          price: book.price,
          stock: book.stock,
          status: book.status,
          imageBase64,
          link: book.link,
          authorName: book.authorId.firstname + ' ' + book.authorId.lastname,
          categoryName: book.category.categoryName,
          publisherName: book.publisherId.publisherName,
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

  async findOne(id: number) {
    try {
      const book = await this.bookRepository.findOne({
        where: { bookid: id },
        relations: ['authorId', 'publisherId', 'category'],
      });

      const bookWithImageBase64 = {
        ...book,
        image: undefined,
        imageBase64: book.image
          ? `data:image/jpeg;base64,${book.image.toString('base64')}`
          : null,
      };
      return ApiRes.success(
        'Hiện thông tin sách thành công',
        bookWithImageBase64,
      );
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
        .where('order.status = :status', { status: 1 })
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

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      const [author, publisher, category] = await Promise.all([
        this.authorRepository
          .createQueryBuilder('author')
          .where("CONCAT(author.firstname, ' ', author.lastname) = :fullname", {
            fullname: updateBookDto.authorName,
          })
          .getOne(),
        this.publisherRepository.findOne({
          where: { publisherName: updateBookDto.publisherName.toString() },
        }),
        this.categoryRepository.findOne({
          where: { categoryName: updateBookDto.categoryName.toString() },
        }),
      ]);

      await this.bookRepository.update(id, {
        title: updateBookDto.title,
        authorId: { authorId: author.authorId },
        category: { categoryId: category.categoryId },
        publisherId: { publisherId: publisher.publisherId },
        price: updateBookDto.price,
        stock: updateBookDto.stock,
        link: updateBookDto.link,
      });
      return ApiRes.success('Cập nhật sách thành công');
    } catch (error) {
      console.log(error.message);
      return ApiRes.error('Không thể cập nhật sách');
    }
  }

  async remove(id: number) {
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
}
