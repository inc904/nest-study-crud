import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// 💡 定义门票内容的严格接口，拒绝 any
interface JwtPayload {
  sub: number;
  username: string;
  role: string;
}

interface RequestWithUser extends Request {
  user: JwtPayload;
}

// 💡 核心：利用 NestJS 内置的 createParamDecorator 打造专属武器
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    // 1. 顺藤摸瓜抓到请求对象，并打上我们安全的自定义类型
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    // 2. 直接把安全员在 AuthGuard 里塞进去的 user 掏出来返回
    return request.user;
  },
);
