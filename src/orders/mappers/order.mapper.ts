import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@/common/mappers/base.mapper';
import { OrderDetailResponse } from '../dto/order.response';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderMapper extends BaseMapper<Order, OrderDetailResponse> {
  toResponse(order: Order): OrderDetailResponse {
    return {
      ...order,
      orderdetails: (order.orderdetails ?? []).map((detail) => ({
        orderdetailId: detail.orderdetailId,
        orderDetailCode: detail.orderDetailCode,
        image: detail.books.thumbnail,
        thumbnail: detail.books.thumbnail,
        quantity: detail.quantity,
        price: detail.price,
        title: detail.books.title,
        sku: detail.books.sku,
      })),
    };
  }
}
