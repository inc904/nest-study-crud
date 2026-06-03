import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor'; // 💡 引入拦截器

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 💡 核心核心：开启跨域资源共享（CORS）特批通行证
  // 内部约定：不传参数默认允许所有的前端（不管是 5173 还是 8080）过来访问我
  app.enableCors();

  // 💡 核心：告诉 NestJS，以后所有接口出去的数据，都要去拦截器里洗个澡
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
