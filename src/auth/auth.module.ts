import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from '@nestjs/config'; // 💡 引入配置服务

@Module({
  imports: [
    PrismaModule,
    // 💡 核心配置：注册 JWT 模块
    JwtModule.registerAsync({
      global: true, // 让 JWT 模块在全局生效，别的模块也能用
      inject: [ConfigService], // 注入配置小秘书
      useFactory: (configService: ConfigService) => ({
        // 💡 通过 configService.get 安全地获取 .env 里的变量
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // 门票有效期：1天（1 day）
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
