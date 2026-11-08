import { randomInt } from 'crypto';

/**
 * Bảng chữ cái sinh mã: bỏ các ký tự dễ nhầm (I, O, 0, 1).
 */
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const CodePrefix = {
  ACCOUNT: 'ACC',
  USER: 'USR',
  ROLE: 'ROL',
  AUTHOR: 'AUT',
  PUBLISHER: 'PUB',
  CATEGORY: 'CAT',
  BOOK: 'SKU',
  CART: 'CRT',
  CART_ITEM: 'CRI',
  ORDER: 'ORD',
  ORDER_DETAIL: 'ODT',
  INVOICE: 'INV',
  INVOICE_ITEM: 'IVT',
  REVIEW: 'REV',
  EMPLOYEE: 'EMP',
} as const;

/**
 * Sinh mã nghiệp vụ dạng PREFIX-XXXXXXXX, ví dụ: SKU-7K2M9QAB.
 * Mã này dùng để giao tiếp với client thay cho khóa chính UUID.
 */
export function generateCode(prefix: string, length = 8): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CODE_ALPHABET[randomInt(0, CODE_ALPHABET.length)];
  }
  return `${prefix}-${code}`;
}
