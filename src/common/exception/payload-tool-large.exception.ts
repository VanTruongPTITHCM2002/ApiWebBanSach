import { HttpException, HttpStatus } from '@nestjs/common';

export class PayloadTooLargeException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.PAYLOAD_TOO_LARGE);
  }
}
