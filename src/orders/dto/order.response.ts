import { Order } from '../entities/order.entity';

export interface OrderDetailItemResponse {
  orderdetailId: string;
  orderDetailCode: string;
  image: string;
  thumbnail: string;
  quantity: number;
  price: number;
  title: string;
  sku: string;
}

export type OrderDetailResponse = Omit<
  Order,
  'orderdetails' | 'assignOrderCode'
> & {
  orderdetails: OrderDetailItemResponse[];
};
