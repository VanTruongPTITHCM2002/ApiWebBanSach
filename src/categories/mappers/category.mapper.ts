import { Injectable } from '@nestjs/common';
import { Book } from '@/books/entities/book.entity';
import {
  CategoryBookResponse,
  CategoryOptionResponse,
  CategorySelectResponse,
} from '../dto/category.response';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryMapper {
  toOption(category: Category): CategoryOptionResponse {
    return {
      id: category.categoryId,
      code: category.categoryCode,
      name: category.categoryName,
    };
  }

  toSelectResponse(category: Category): CategorySelectResponse {
    return {
      name: category.categoryName,
      categoryId: category.categoryId,
      categoryCode: category.categoryCode,
    };
  }

  toBookItem(book: Book): CategoryBookResponse {
    return {
      bookid: book.bookid,
      sku: book.sku,
      title: book.title,
      price: book.price,
      authorName: `${book.authorId.firstname} ${book.authorId.lastname}`,
      thumbnail: book.thumbnail ? book.thumbnail : null,
    };
  }
}
