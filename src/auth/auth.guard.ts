import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  sub: number;
  username: string;
  role?: string;
}

interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // A. 从请求头（Headers）里取出 Authorization 字段
    const authHeader: string | undefined = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException(
        '安检失败：你没有携带身份令牌（Token）！',
      );
    }

    // B. 解析token， 标准的格式通常是 "Bearer eyJhbG..."，我们需要把前面的 Bearer 抠掉
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        '安检失败：你的身份令牌（Token）格式不对！',
      );
    }

    try {
      // C. 核心。验证 token 是否为真， 是否过期
      // 如果是真的，会把解密出来的用户信息（id, username, role）塞进 request 里，方便后续使用
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = payload;
    } catch {
      throw new UnauthorizedException(
        '安检失败：你的身份令牌（Token）已经过期或无效！',
      );
    }
    // D. 放行！允许访问后面的 Controller
    return true;
  }
}
