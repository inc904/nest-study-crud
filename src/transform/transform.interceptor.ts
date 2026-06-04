import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as ExpressResponse } from 'express'; // 💡 引入 Express 的响应类型

interface ResponseFormat<T> {
  success: boolean;
  data: T;
  code: number; // 💡 1. 契约升级：明确加上前端想要的 code 字段
  message: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  unknown,
  ResponseFormat<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<ResponseFormat<T>> {
    // 💡 2. 内部约定：从上下文中抓取当前的 HTTP 响应对象（Express 的 response）
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<ExpressResponse>();

    // 💡 3. 动态获取当前真实的 HTTP 状态码（比如 200, 201）
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data: unknown) => {
        let msg = '请求成功';
        let finalData: unknown = data;

        // 💡 1. 严格探测未知对象
        if (data && typeof data === 'object') {
          // 💡 2. 用 in 关键字安全收窄。只要通过这个 if，TS 会自动推导出 data 必然包含这两个属性
          if ('message' in data && 'data' in data) {
            // 💡 3. 核心修复：直接、自信地读取它们！不再需要写无聊的 as 强转，ESLint 直接给满分！
            msg = String(data.message);
            finalData = data.data;
          }
        }

        return {
          success: true,
          code: statusCode, // 💡 4. 核心修复：把 200 或 201 动态塞进去！完美契合前端的 Axios 拦截器！
          data: finalData as T, // 💡 只有这里需要把外层的普通 T 返回去
          message: msg,
        };
      }),
    );
  }
}
