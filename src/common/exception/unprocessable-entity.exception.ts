import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ExceptionDetails } from './base.exception';

export class UnprocessableEntityException extends BaseHttpException {
  constructor(message: string, details?: ExceptionDetails) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, details);
  }
}
