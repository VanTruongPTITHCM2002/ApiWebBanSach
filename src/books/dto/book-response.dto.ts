export class BookResponse {
  bookid: number;
  title: string;
  isDeleted: boolean;
  price: number;
  stock: number;
  status: boolean;
  imageBase64: string | null;
  link: string | null;
  authorName: string;
  categoryName: string;
  publisherName: string;
}
