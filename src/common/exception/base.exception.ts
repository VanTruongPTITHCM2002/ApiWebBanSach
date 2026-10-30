import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Dữ liệu lỗi chi tiết trả về cho client.
 * Có thể là message, danh sách message hoặc object (ví dụ lỗi validate từng field).
 */
export type ExceptionDetails = string | string[] | Record<string, unknown>;

/**
 * Exception gốc cho toàn bộ ứng dụng.
 * Mọi exception nghiệp vụ nên kế thừa class này để thống nhất format response
 * mà GlobalHandlerException sẽ bắt và trả về.
 */
export abstract class BaseHttpException extends HttpException {
  constructor(message: string, status: HttpStatus, details?: ExceptionDetails) {
    super({ statusCode: status, message, details }, status);
  }
}
