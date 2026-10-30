import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ExceptionDetails } from './base.exception';

export class ConflictException extends BaseHttpException {
  constructor(message: string, details?: ExceptionDetails) {
    super(message, HttpStatus.CONFLICT, details);
  }
}
