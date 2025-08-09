import { Injectable, Logger } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Author } from 'src/authors/entities/author.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ApiRes } from 'src/response/response.dto';

@Injectable()
export class BooksService {
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
  ) {}

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

  async findAll(page: number, size: number) {
    try {
      const books = await this.bookRepository.find({
        skip: (page - 1) * size,
        take: size,
        where: {
          isDeleted: false,
        },
      });
      const booksWithBase64 = books.map((book) => {
        let imageBase64 = null;

        if (book.image && book.image instanceof Buffer) {
          imageBase64 = `data:image/jpeg;base64,${book.image.toString('base64')}`;
        }

        return {
          ...book,
          imageBase64, // thêm thuộc tính mới
        };
      });

      return ApiRes.success('Hiện danh sách sách thành công', booksWithBase64);
    } catch (error) {
      return ApiRes.error('Không thể hiện danh sách sách');
    }
  }

  async filter(
    page: number,
    size: number,
    status: boolean | null,
    minPrice: number | null,
    maxPrice: number | null,
  ) {
    minPrice = isNaN(minPrice) ? null : minPrice;
    maxPrice = isNaN(maxPrice) ? null : maxPrice;
    const where: any = {
      isDeleted: false,
    };

    if (status !== null) where.status = status;
    where.price =
      minPrice != null && maxPrice != null
        ? Between(minPrice, maxPrice)
        : minPrice !== null
          ? MoreThanOrEqual(minPrice)
          : maxPrice !== null
            ? LessThanOrEqual(maxPrice)
            : null;
    try {
      const books = await this.bookRepository.find({
        skip: (page - 1) * size,
        take: size,
        where,
      });

      const booksWithBase64 = books.map((book) => {
        let imageBase64 = null;

        if (book.image && book.image instanceof Buffer) {
          imageBase64 = `data:image/jpeg;base64,${book.image.toString('base64')}`;
        }

        return {
          ...book,
          imageBase64, // thêm thuộc tính mới
        };
      });

      return ApiRes.success('Hiện danh sách sách thành công', booksWithBase64);
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: number) {
    try {
      const book = await this.bookRepository.findOne({
        where: { bookid: id },
        relations: ['authorId', 'publisherId', 'category'],
      });

      // Gán lại hoặc tạo trường mới (nên tạo mới để khỏi lẫn lộn)
      const bookWithImageBase64 = {
        ...book,
        image: undefined, // hoặc xóa trường image gốc
        imageBase64: book.image
          ? `data:image/jpeg;base64,${book.image.toString('base64')}`
          : null,
      };
      this.log.log('Hiện thông tin sách thành công');
      return ApiRes.success(
        'Hiện thông tin sách thành công',
        bookWithImageBase64,
      );
    } catch (error) {
      console.log(error.message);
      this.log.error('Không thể hiện thông tin sách');
      return ApiRes.error('Không thể hiện thông tin sách', 'Thất bại');
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
