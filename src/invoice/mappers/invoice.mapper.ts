import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@/common/mappers/base.mapper';
import { InvoiceDetailResponse } from '../dto/invoice.response';
import { Invoice } from '../entities/invoice.entity';

@Injectable()
export class InvoiceMapper extends BaseMapper<Invoice, InvoiceDetailResponse> {
  toResponse(invoice: Invoice): InvoiceDetailResponse {
    return {
      invoiceId: invoice.invoiceId,
      invoiceCode: invoice.invoiceCode,
      issueDate: invoice.issueDate,
      totalAmount: invoice.totalAmount,
      paymentStatus: invoice.paymentStatus,
      paymentMethod: invoice.paymentMethod,
      note: invoice.note,
      username: invoice.userId.accountFK.username,
      fullName: `${invoice.userId.firstname} ${invoice.userId.lastname}`,
      orderId: invoice.order.orderId,
      orderCode: invoice.order.orderCode,
      items: invoice.invoiceItems.map((item) => ({
        invoiceitemId: item.invoiceitemId,
        invoiceItemCode: item.invoiceItemCode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalLine: item.totalLine,
        bookid: item.book.bookid,
        sku: item.book.sku,
        title: item.book.title,
        image: item.book.thumbnail,
      })),
    };
  }
}
