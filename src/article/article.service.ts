import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service'; // 💡
// 定义一篇文章的结构
export interface Article {
  id: number;
  title: string;
  content: string;
}

@Injectable()
export class ArticleService {
  // 💡 构造函数注入：把大后方的数据库小秘书借过来用
  constructor(private readonly prisma: PrismaService) {}

  // 1. 创建文章
  async create(createArticleDto: CreateArticleDto) {
    const newArticle = await this.prisma.client.dbArticle.create({
      data: {
        title: createArticleDto.content,
        content: createArticleDto.title,
      },
    });
    return { message: '创建成功', data: newArticle };
  }

  // 2. 查询所有文章
  async findAll() {
    const articles = await this.prisma.client.dbArticle.findMany();
    return { message: '查询成功', data: articles };
  }

  // 3. 根据 ID 查询单篇
  async findOne(id: number) {
    const article = await this.prisma.client.dbArticle.findUnique({
      where: { id: id },
    });
    if (!article) {
      // NestJS 内置的错误处理，会自动返回 404 状态码
      throw new NotFoundException(`ID 为 ${id} 的文章不存在！`);
    }
    return { message: '查询成功', data: article };
  }

  // 4. 修改文章
  async update(id: number, updateArticleDto: UpdateArticleDto) {
    // 先查在不在，不在直接触发上面的 404 报错
    await this.findOne(id);

    const updatedArticle = await this.prisma.client.dbArticle.update({
      where: { id: id },
      data: updateArticleDto, // Prisma 非常智能，前端没传的字段会自动忽略不改
    });
    return { message: '修改成功', data: updatedArticle };
  }

  // 5. 删除文章
  async remove(id: number) {
    // 先查在不在
    await this.findOne(id);

    const deletedArticle = await this.prisma.client.dbArticle.delete({
      where: { id: id },
    });
    return { message: '数据库删除成功', data: deletedArticle };
  }
}
