export interface CartItemResponse {
  cartItemId: string;
  cartItemCode: string;
  quantity: number;
  price: number;
  title: string;
  sku: string;
  thumbnail: string;
}

export class CartResponse {
  cartId: string | null;
  cartCode: string | null;
  createAt: Date | null;
  status: boolean;
  cartItems: CartItemResponse[];
}
