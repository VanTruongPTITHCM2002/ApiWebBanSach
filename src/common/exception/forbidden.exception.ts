import { HttpException, HttpStatus } from '@nestjs/common';

export class ForBiddenException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}
