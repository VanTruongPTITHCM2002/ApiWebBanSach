import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;
    if (!token) throw new UnauthorizedException('Token không được cung cấp');

    try {
      // Xác thực token
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      request.user = payload;
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Vui lòng xác thực lại token đã hết hạn',
        );
      } else if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token không hợp lệ');
      }
      throw new UnauthorizedException('Xác thực thất bại');
    }
  }
}
