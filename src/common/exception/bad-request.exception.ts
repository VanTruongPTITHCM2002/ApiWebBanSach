import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ExceptionDetails } from './base.exception';

export class BadRequestException extends BaseHttpException {
  constructor(message: string, details?: ExceptionDetails) {
    super(message, HttpStatus.BAD_REQUEST, details);
  }
}
