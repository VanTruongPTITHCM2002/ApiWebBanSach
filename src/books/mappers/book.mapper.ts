import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@/common/mappers/base.mapper';
import {
  BookBase64ItemResponse,
  BookDetailResponse,
  BookFilterItemResponse,
  BookListItemResponse,
} from '../dto/book.response';
import { Book } from '../entities/book.entity';

@Injectable()
export class BookMapper extends BaseMapper<Book, BookDetailResponse> {
  toResponse(book: Book): BookDetailResponse {
    return {
      bookid: book.bookid,
      sku: book.sku,
      title: book.title,
      isDeleted: book.isDeleted,
      price: book.price,
      stock: book.stock,
      status: book.status,
      imagesBase64: this.toBase64(book),
      authorId: book.authorId.id,
      authorName: this.authorName(book),
      categoryName: book.category.categoryName,
      categoryId: book.category.categoryId,
      publisherName: book.publisher.publisherName,
      publisherId: book.publisher.publisherId,
      thumbnail: book.thumbnail,
      images: book.images,
    };
  }

  toListItem(book: Book): BookListItemResponse {
    return {
      bookid: book.bookid,
      sku: book.sku,
      title: book.title,
      isDeleted: book.isDeleted,
      price: book.price,
      stock: book.stock,
      status: book.status,
      thumbnail: book.thumbnail,
      images: book.images,
      imagesBase64: this.toBase64(book),
      authorName: this.authorName(book),
      categoryName: book.category.categoryName,
      publisherName: book.publisher.publisherName,
      createdAt: book.createdAt,
    };
  }

  toFilterItem(book: Book): BookFilterItemResponse {
    return {
      bookid: book.bookid,
      sku: book.sku,
      title: book.title,
      isDeleted: book.isDeleted,
      price: book.price,
      stock: book.stock,
      status: book.status,
      images: book.images,
      thumbnail: book.thumbnail,
      authorName: this.authorName(book),
      categoryName: book.category.categoryName,
      publisherName: book.publisher.publisherName,
      createdAt: book.createdAt,
      isActive: book.isActive,
    };
  }

  toBase64Item(book: Book): BookBase64ItemResponse {
    return {
      ...book,
      authorName: this.authorName(book),
      categoryName: book.category.categoryName,
      publisherName: book.publisher.publisherName,
      imagesBase64: this.toBase64(book),
    };
  }

  private authorName(book: Book): string {
    return `${book.authorId.firstname} ${book.authorId.lastname}`;
  }

  private toBase64(book: Book): string | null {
    if (book.images && book.images instanceof Buffer) {
      return `data:images/jpeg;base64,${book.images.toString('base64')}`;
    }
    return null;
  }
}
