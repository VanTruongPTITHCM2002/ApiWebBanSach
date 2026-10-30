import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ExceptionDetails } from './base.exception';

export class HttpVersionNotSupportedException extends BaseHttpException {
  constructor(message: string, details?: ExceptionDetails) {
    super(message, HttpStatus.HTTP_VERSION_NOT_SUPPORTED, details);
  }
}
