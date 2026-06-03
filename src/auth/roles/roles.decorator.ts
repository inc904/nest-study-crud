import { SetMetadata } from '@nestjs/common';

// 💡 它的作用就是往接口上贴一个“权限标签”，比如 @Roles('admin')
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
