import { HttpException, HttpStatus } from '@nestjs/common';

export class RequestTimeoutException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.REQUEST_TIMEOUT);
  }
}
