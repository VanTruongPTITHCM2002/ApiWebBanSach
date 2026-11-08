export interface InvoiceItemResponse {
  invoiceitemId: string;
  invoiceItemCode: string;
  quantity: number;
  unitPrice: number;
  totalLine: number;
  bookid: string;
  sku: string;
  title: string;
  image: string;
}

export class InvoiceDetailResponse {
  invoiceId: string;
  invoiceCode: string;
  issueDate: Date;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  note?: string;
  username: string;
  fullName: string;
  orderId: string;
  orderCode: string;
  items: InvoiceItemResponse[];
}
