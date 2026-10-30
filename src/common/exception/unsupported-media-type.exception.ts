import { HttpStatus } from '@nestjs/common';
import { BaseHttpException, ExceptionDetails } from './base.exception';

export class UnsupportedMediaTypeException extends BaseHttpException {
  constructor(message: string, details?: ExceptionDetails) {
    super(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE, details);
  }
}
