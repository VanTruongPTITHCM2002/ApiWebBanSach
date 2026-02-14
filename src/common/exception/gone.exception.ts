import { HttpException, HttpStatus } from '@nestjs/common';

export class GoneException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.GONE);
  }
}
