import { ApiRes } from '@/response/response.dto';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class GlobalHandlerException implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const message = exception.getResponse()?.['message'] ?? exception.message;
    const errors = exception.getResponse()?.['errors'] ?? exception.errors;
    const status = exception.getStatus();

    response
      .status(status)
      .json(new ApiRes(false, null, message, null, errors));
  }
}
