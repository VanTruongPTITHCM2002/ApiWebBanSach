import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@/common/mappers/base.mapper';
import { CartResponse } from '../dto/cart.response';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartMapper extends BaseMapper<Cart, CartResponse> {
  toResponse(cart: Cart): CartResponse {
    return {
      cartId: cart.cartId,
      cartCode: cart.cartCode,
      createAt: cart.createAt,
      status: cart.isActive,
      cartItems: (cart.cartItemId ?? []).map((item) => ({
        cartItemId: item.cartitemId,
        cartItemCode: item.cartItemCode,
        quantity: item.quantity,
        price: item.price,
        title: item.bookId.title,
        sku: item.bookId.sku,
        thumbnail: item.bookId.thumbnail,
      })),
    };
  }

  toEmptyResponse(): CartResponse {
    return {
      cartId: null,
      cartCode: null,
      createAt: null,
      status: true,
      cartItems: [],
    };
  }
}
