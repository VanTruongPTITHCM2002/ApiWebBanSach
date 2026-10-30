import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { MessageError } from '@/enum/message.error.enum';
import { ApiRes } from '@/response/response.dto';
import { ExceptionDetails } from './base.exception';

interface ResolvedException {
  status: number;
  message: string;
  errors?: ExceptionDetails | null;
}

/**
 * Global exception filter: bắt TẤT CẢ lỗi (HttpException, lỗi TypeORM và lỗi
 * không xác định) để trả về cùng một format ApiRes cho client.
 */
@Catch()
export class GlobalHandlerException implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHandlerException.name);
  private readonly isDev = process.env.NODE_ENV !== 'production';

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const resolved = this.resolve(exception);

    if (resolved.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request?.method ?? '-'} ${request?.url ?? '-'} -> ${resolved.status}: ${resolved.message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response
      .status(resolved.status)
      .json(
        new ApiRes(
          false,
          resolved.status,
          resolved.message,
          null,
          resolved.errors ?? null,
        ),
      );
  }

  private resolve(exception: unknown): ResolvedException {
    if (exception instanceof HttpException) {
      return this.fromHttpException(exception);
    }

    if (exception instanceof QueryFailedError) {
      return this.fromQueryFailedError(exception);
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: MessageError.INTERNAL_SERVER_ERROR,
      // Chỉ trả message gốc khi dev, production tránh lộ thông tin hệ thống.
      errors:
        this.isDev && exception instanceof Error ? exception.message : null,
    };
  }

  private fromHttpException(exception: HttpException): ResolvedException {
    const status = exception.getStatus();
    const body = exception.getResponse();

    if (typeof body === 'string') {
      return { status, message: body };
    }

    const payload = body as Record<string, any>;

    return {
      status,
      message: this.normalizeMessage(payload.message ?? exception.message),
      errors: payload.details ?? payload.formattedErrors ?? payload.errors,
    };
  }

  private fromQueryFailedError(exception: QueryFailedError): ResolvedException {
    const code =
      (exception as any).driverError?.code ?? (exception as any).code;

    switch (code) {
      case 'ER_DUP_ENTRY':
        return {
          status: HttpStatus.CONFLICT,
          message: 'Dữ liệu đã tồn tại',
        };
      case 'ER_NO_REFERENCED_ROW':
      case 'ER_NO_REFERENCED_ROW_2':
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Dữ liệu tham chiếu không tồn tại',
        };
      case 'ER_ROW_IS_REFERENCED':
      case 'ER_ROW_IS_REFERENCED_2':
        return {
          status: HttpStatus.CONFLICT,
          message: 'Dữ liệu đang được sử dụng, không thể xóa',
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: MessageError.INTERNAL_SERVER_ERROR,
          errors: this.isDev ? exception.message : null,
        };
    }
  }

  private normalizeMessage(message: unknown): string {
    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    if (message && typeof message === 'object') {
      return (message as any).message ?? JSON.stringify(message);
    }

    return MessageError.INTERNAL_SERVER_ERROR;
  }
}
