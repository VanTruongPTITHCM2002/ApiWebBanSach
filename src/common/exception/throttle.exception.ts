import { MessageError } from '@/enum/message.error.enum';
import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from './base.exception';

export class ThrottleException extends BaseHttpException {
  constructor() {
    super(MessageError.TOO_MANY_REQUEST, HttpStatus.TOO_MANY_REQUESTS);
  }
}
