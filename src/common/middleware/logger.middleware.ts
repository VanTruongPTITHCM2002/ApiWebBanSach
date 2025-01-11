import { Injectable, NestMiddleware } from '@nestjs/common';
@Injectable()
export class LoogerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: Error | any) => void) {
    console.log(`[Logger] ${req.method} ${res.url}`);
    next();
  }
}
