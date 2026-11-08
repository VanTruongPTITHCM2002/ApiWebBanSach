import { Injectable } from '@nestjs/common';
import { OrderDetailCreatedResponse } from '../dto/orderdetail.response';
import { Order } from '@/orders/entities/order.entity';

@Injectable()
export class OrderdetailMapper {
  toCreatedResponse(
    order: Order,
    totalAmount: number,
  ): OrderDetailCreatedResponse {
    return {
      orderId: order.orderId,
      orderCode: order.orderCode,
      totalAmount,
      methodPay: order.methodPay,
    };
  }
}
