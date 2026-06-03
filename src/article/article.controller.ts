import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';

import { CurrentUser } from '../auth/current-user.decorator'; // 自定义装饰器

// 💡 定义一个局部的接口方便我们在 Controller 里对齐类型
interface UserInfo {
  sub: number;
  username: string;
  role: string;
}

@Controller('article') // 基础路由：http://localhost:3000/article
@UseGuards(AuthGuard, RolesGuard) // 💡 核心核心：给整个部门装上安检闸门！
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post() // POST /article (创建)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @CurrentUser() user: UserInfo, // 💡 核心：像吸星大法一样，直接隔空把当前登录的用户抓过来！
  ) {
    console.log('接收到前端的数据了：', createArticleDto);
    // 💡 工业级安全体验：前端在 Body 里根本不需要传作者是谁，后端通过 Token 就能绝对信任地知道是谁发的！
    console.log(`用户 ${user.username} (ID: ${user.sub}) 正在创建文章...`);
    return await this.articleService.create(createArticleDto);
  }

  @Get() // GET /article (查所有)
  async findAll() {
    return await this.articleService.findAll();
  }

  // 💡 注意这里加了 ParseIntPipe，它会自动把 URL 里的字符串 id 转成真正的数字数字
  @Get(':id') // GET /article/1 (查单条)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.articleService.findOne(id);
  }

  @Patch(':id') // PATCH /article/1 (改)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return await this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id') // DELETE /article/1 (删)
  @Roles('admin') // 💡 核心核心：只有删除接口被贴上了“必须是 admin”的硬核标签！
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.articleService.remove(id);
  }
}
