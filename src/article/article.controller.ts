import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article') // 基础路由：http://localhost:3000/article
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post() // POST /article (创建)
  async create(@Body() createArticleDto: CreateArticleDto) {
    console.log('接收到前端的数据了：', createArticleDto);
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.articleService.remove(id);
  }
}
