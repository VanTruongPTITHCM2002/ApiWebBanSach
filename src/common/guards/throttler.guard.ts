import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottleException } from '../exception/throttle.exception';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async throwThrottlingException(
    _context: ExecutionContext,
  ): Promise<void> {
    throw new ThrottleException();
  }
}
