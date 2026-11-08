import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const method = req.method;
    const url = req.path;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: (result) => {
          const elapsed = Date.now() - now;
          const status =
            typeof result?.statusCode === 'number'
              ? result.statusCode
              : res.statusCode;
          const message = `${method} ${url} ${status} - ${elapsed}ms`;

          if (status >= 500) {
            this.logger.error(message);
          } else if (status >= 400) {
            this.logger.warn(message);
          } else {
            this.logger.log(message);
          }
        },
        error: (error: unknown) => {
          const elapsed = Date.now() - now;
          const status =
            error instanceof HttpException ? error.getStatus() : 500;
          const message = `${method} ${url} ${status} - ${elapsed}ms`;

          if (status >= 500) {
            this.logger.error(
              message,
              error instanceof Error ? error.stack : undefined,
            );
          } else {
            this.logger.warn(message);
          }
        },
      }),
    );
  }
}
