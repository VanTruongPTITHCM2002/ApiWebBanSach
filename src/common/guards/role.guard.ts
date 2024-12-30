import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy role yêu cầu từ metadata
    const requiredRole = this.reflector.get<string>(
      'role',
      context.getHandler(),
    );
    if (!requiredRole) {
      return true; // Nếu không yêu cầu role, cho phép truy cập
    }

    // Lấy thông tin user từ request (gắn bởi JwtAuthGuard)
    const request = context.switchToHttp().getRequest();
    const user = request.user;
  
    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException('Access denied for this role');
    }

    return true;
  }
}
