import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// 💡 核心：引入 Express 的标准 Request 类型
import { Request } from 'express';

// 💡 1. 既然不让用 any，我们就自己定义一个完美的“JwtPayload（门票内容）”结构
interface JwtPayload {
  sub: number;
  username: string;
  role: string; // 明确告诉系统，里面百分百有 role，而且是 string
}
// 💡 2. 定义一个继承自 Express Request 的新类型，告诉系统我们塞了一个合法的 user 进去
interface RequestWithUser extends Request {
  user: JwtPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  // 💡 注入 Reflector（反射器），用来读取接口上贴的 @Roles 标签
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // A. 抓取当前接口上贴的目标角色标签
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // B. 如果接口上根本没贴标签，说明这个接口不需要特殊权限，直接放行！
    if (!requiredRoles) {
      return true;
    }

    // C. 拿到在上一步 AuthGuard 里塞进 request 的用户信息
    // const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    // D. 比对用户的角色是不是在接口要求的角色列表里
    if (!user || !user.role) {
      throw new ForbiddenException('权限不足：无法识别用户身份角色！');
    }

    const hasRole = requiredRoles.includes(user?.role);

    if (!hasRole) {
      // 💡 如果身份不符，报 403 错误（拒绝访问）
      throw new ForbiddenException(
        '权限不足：只有管理员(admin)才能执行此操作！',
      );
    }

    return true;
  }
}
