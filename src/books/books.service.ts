import { Injectable, Logger } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
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

  async create(createBookDto: CreateBookDto) {
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
      if (!author || !publisher || !category) {
        this.log.error(
          `Không tìm thấy: ${
            !author ? 'Tác giả ' : ''
          }${!publisher ? 'Nhà xuất bản ' : ''}${!category ? 'Thể loại ' : ''}`,
        );
        return ApiRes.notFound('Dữ liệu không hợp lệ', 'Thất bại');
      }

      const book = {
        title: createBookDto.title,
        authorId: author,
        categoryId: category,
        publisherId: publisher,
        price: createBookDto.price,
        stock: createBookDto.stock,
        isDeleted: false,
      };
      await this.bookRepository.save(book);
      this.log.log('Thêm sách thành công');
      return ApiRes.success('Thêm sách thành công', 'Thành công');
    } catch (error) {
      this.log.error(error);
      return ApiRes.error('Không thể thêm sách', 'Thất bại');
    }
  }

  async findAll() {
    try {
      const books = await this.bookRepository.find({
        relations: ['authorId', 'publisherId', 'category'],
      });
      this.log.log('Hiện danh sách sách thành công');
      return ApiRes.success('Hiện danh sách sách thành công', books);
    } catch (error) {
      this.log.error('Không thể hiện danh sách sách');
      return ApiRes.error('Không thể hiện danh sách sách', 'Thất bại');
    }
  }

  async findOne(id: number) {
    try {
      const book = await this.bookRepository.findOne({
        where: { bookid: id },
        relations: ['authorId', 'publisherId', 'categoryId'],
      });
      this.log.log('Hiện thông tin sách thành công');
      return ApiRes.success('Hiện thông tin sách thành công', book);
    } catch (error) {
      this.log.error('Không thể hiện thông tin sách');
      return ApiRes.error('Không thể hiện thông tin sách', 'Thất bại');
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      await this.bookRepository.update(id, updateBookDto);
      this.log.log('Cập nhật sách thành công');
      return ApiRes.success('Cập nhật sách thành công', 'Thành công');
    } catch (error) {
      this.log.error('Không thể cập nhật sách');
      return ApiRes.error('Không thể cập nhật sách', 'Thất bại');
    }
  }

  async remove(id: number) {
    try {
      const book = await this.bookRepository.findOne({
        where: { bookid: id },
      });
      if (!book) {
        this.log.error('Không tìm thấy sách');
        return ApiRes.notFound('Không tìm thấy sách', 'Thất bại');
      }
      book.isDeleted = true;
      await this.bookRepository.save(book);
      this.log.log('Xóa sách thành công');
      return ApiRes.success('Xóa sách thành công', 'Thành công');
    } catch (error) {
      this.log.error('Không thể xóa sách');
      return ApiRes.error('Không thể xóa sách', 'Thất bại');
    }
  }
}
