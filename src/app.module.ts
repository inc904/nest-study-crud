import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

import { ConfigModule } from '@nestjs/config'; // 💡 引入官方配置模块

@Module({
  imports: [
    // 💡 核心：必须放在最上面！
    ConfigModule.forRoot({
      isGlobal: true, // 让配置模块在全局生效，这样别的 Module 才能读到 .env
    }),
    ArticleModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
