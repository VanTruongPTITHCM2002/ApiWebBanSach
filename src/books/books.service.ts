import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { Author } from 'src/authors/entities/author.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Builder } from 'builder-pattern';
import { ApiResponse } from 'src/response/apires';

@Injectable()
export class BooksService {
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
    let author: Author = null;
    let publisher: Publisher = null;
    let category: Category = null;
    try {
      author = await this.authorRepository
        .createQueryBuilder('author')
        .where("CONCAT(author.firstname, ' ', author.lastname) = :fullname", {
          fullname: createBookDto.authorName,
        })
        .getOne();

      if (!author) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message('Không tìm thấy tác giả')
          .data('')
          .build();
      }
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện tìm tác giả')
        .data('')
        .build();
    }

    try {
      publisher = await this.publisherRepository.findOne({
        where: { publisherName: createBookDto.publisherName.toString() },
      });

      if (!publisher) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message('Không tìm thấy nhà xuất bản')
          .data('')
          .build();
      }
    } catch (error) {
      console.error('Error finding publisher:', error);
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện tìm nhà xuất bản')
        .data('')
        .build();
    }

    try {
      category = await this.categoryRepository.findOne({
        where: { categoryName: createBookDto.categoryName.toString() },
      });

      if (!category) {
        return Builder<ApiResponse<any>>()
          .statusCode(HttpStatus.NOT_FOUND)
          .message('Không tìm thấy danh mục')
          .data('')
          .build();
      }
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện tìm danh mục')
        .data('')
        .build();
    }

    try {
      const book = {
        title: createBookDto.title,
        authorId: author,
        categoryId: category,
        publisherId: publisher,
        price: createBookDto.price,
        stock: createBookDto.stock,
      };
      await this.bookRepository.save(book);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện thêm sách')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.CREATED)
      .message('Thêm sách thành công')
      .data('')
      .build();
  }

  async findAll() {
    let books: Book[] = [];
    try {
      books = await this.bookRepository.find({
        relations: ['authorId', 'publisherId', 'categoryId'],
      });
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể hiện danh sách của sách')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Danh sách của sách')
      .data(books)
      .build();
  }

  async findOne(id: number) {
    let book: Book = null;
    try {
      book = await this.bookRepository.findOne({
        where: { bookid: id },
        relations: ['authorId', 'publisherId', 'categoryId'],
      });
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể hiện danh sách của sách')
        .data(book)
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Tìm sách thành công')
      .data(book)
      .build();
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    try {
      await this.bookRepository.update(id, updateBookDto);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện cập nhật sách')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Cập nhật sách thành công')
      .data('')
      .build();
  }

  async remove(id: number) {
    try {
      await this.bookRepository.delete(id);
    } catch (error) {
      return Builder<ApiResponse<any>>()
        .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
        .message('Không thể thực hiện xóa sách')
        .data('')
        .build();
    }
    return Builder<ApiResponse<any>>()
      .statusCode(HttpStatus.OK)
      .message('Xóa sách thành công')
      .data('')
      .build();
  }
}
