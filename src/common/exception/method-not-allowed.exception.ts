import { HttpException, HttpStatus } from '@nestjs/common';

export class MethodNotAllowedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.METHOD_NOT_ALLOWED);
  }
}
