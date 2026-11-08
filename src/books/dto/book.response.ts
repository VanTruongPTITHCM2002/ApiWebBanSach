import { Book } from '../entities/book.entity';

export class BookListItemResponse {
  bookid: string;
  sku: string;
  title: string;
  isDeleted: boolean;
  price: number;
  stock: number;
  status: boolean;
  thumbnail: string;
  images: string[];
  imagesBase64: string | null;
  authorName: string;
  categoryName: string;
  publisherName: string;
  createdAt: Date;
}

export class BookFilterItemResponse {
  bookid: string;
  sku: string;
  title: string;
  isDeleted: boolean;
  price: number;
  stock: number;
  status: boolean;
  images: string[];
  thumbnail: string;
  authorName: string;
  categoryName: string;
  publisherName: string;
  createdAt: Date;
  isActive: boolean;
}

export class BookDetailResponse {
  bookid: string;
  sku: string;
  title: string;
  isDeleted: boolean;
  price: number;
  stock: number;
  status: boolean;
  imagesBase64: string | null;
  authorId: string;
  authorName: string;
  categoryName: string;
  categoryId: string;
  publisherName: string;
  publisherId: string;
  thumbnail: string;
  images: string[];
}

export type BookBase64ItemResponse = Omit<Book, 'assignSku'> & {
  authorName: string;
  categoryName: string;
  publisherName: string;
  imagesBase64: string | null;
};
