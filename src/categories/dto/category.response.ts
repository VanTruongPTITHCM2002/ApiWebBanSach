export class CategoryOptionResponse {
  id: string;
  code: string;
  name: string;
}

export class CategorySelectResponse {
  name: string;
  categoryId: string;
  categoryCode: string;
}

export class CategoryBookResponse {
  bookid: string;
  sku: string;
  title: string;
  price: number;
  authorName: string;
  thumbnail: string | null;
}
