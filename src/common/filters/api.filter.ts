import { ApiRes } from '@/response/response.dto';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
// đường dẫn đến class ApiRes của bạn

@Catch(HttpException)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message || 'Lỗi không xác định';

    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        response.status(status).json(
          ApiRes.unauthorized(message, 'Thất bại'), // định dạng theo ApiRes
        );
        break;
      case HttpStatus.BAD_REQUEST:
        response.status(status).json(
          ApiRes.badRequest(message, 'Thất bại'), // định dạng theo ApiRes
        );
        break;
      case HttpStatus.FORBIDDEN:
        response.status(status).json(
          ApiRes.forbidden(message, 'Thất bại'), // định dạng theo ApiRes
        );
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        response.status(status).json(
          ApiRes.internalServerError(message, 'Thất bại'), // định dạng theo ApiRes
        );
        break;
      case HttpStatus.NOT_FOUND:
        response.status(status).json(
          ApiRes.notFound(message, 'Thất bại'), // định dạng theo ApiRes
        );
        break;
    }
  }
}
