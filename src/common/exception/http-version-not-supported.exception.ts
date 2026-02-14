import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpVersionNotSupportedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.HTTP_VERSION_NOT_SUPPORTED);
  }
}
