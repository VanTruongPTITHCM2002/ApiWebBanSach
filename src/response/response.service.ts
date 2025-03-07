import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  success<T>(data: T, message = 'Thành công', statusCode = 200) {
    return {
      statusCode,
      message,
      data,
      error: null,
    };
  }
  error(message = 'Thất bại', statusCode = 500, error: string | object) {
    return {
      statusCode,
      message,
      error,
    };
  }
}
