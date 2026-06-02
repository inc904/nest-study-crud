import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // 1. 创建 pg 驱动的连接池（配置和我们在 prisma.config.ts 里填的死死对应）
  private pool = new Pool({
    connectionString:
      'postgresql://postgres:mysecretpassword@127.0.0.1:5432/nest_study',
  });

  // 2. 创建 Prisma 专用的 Postgres 适配器
  private adapter = new PrismaPg(this.pool);

  // 3. 核心：把 adapter 作为参数传进去！报错瞬间解决！
  public client = new PrismaClient({ adapter: this.adapter });

  async onModuleInit() {
    // 项目启动时连接数据库
    await this.client.$connect();
  }

  async onModuleDestroy() {
    // 项目关闭时释放连接
    await this.client.$disconnect();
    await this.pool.end();
  }
}
