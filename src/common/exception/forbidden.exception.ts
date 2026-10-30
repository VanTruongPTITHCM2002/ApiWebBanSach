import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ExceptionDetails } from './base.exception';

export class ForBiddenException extends BaseHttpException {
  constructor(message: string, details?: ExceptionDetails) {
    super(message, HttpStatus.FORBIDDEN, details);
  }
}
