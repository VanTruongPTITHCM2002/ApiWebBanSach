import { HttpException, HttpStatus } from '@nestjs/common';

export class ServiceUnavailableException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE);
  }
}
