import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

// 定义一篇文章的结构
export interface Article {
  id: number;
  title: string;
  content: string;
}

@Injectable()
export class ArticleService {
  // 💡 用一个内存数组模拟数据库
  private articles: Article[] = [
    { id: 1, title: '第一篇测试文章', content: 'NestJS 真好玩！' },
    { id: 2, title: '第二篇测试文章', content: '今天开始学后端。' },
  ];
  private idCounter = 3; // 用来生成自增 ID

  // 1. 创建文章
  create(createArticleDto: CreateArticleDto) {
    const newArticle = {
      id: this.idCounter++,
      ...createArticleDto, // 把前端传来的 title 和 content 展开放进来
    };
    this.articles.push(newArticle);
    return { message: '创建成功', data: newArticle };
  }

  // 2. 查询所有文章
  findAll() {
    return { message: '查询成功', data: this.articles };
  }

  // 3. 根据 ID 查询单篇
  findOne(id: number) {
    const article = this.articles.find((item) => item.id === id);
    if (!article) {
      // NestJS 内置的错误处理，会自动返回 404 状态码
      throw new NotFoundException(`ID 为 ${id} 的文章不存在！`);
    }
    return { message: '查询成功', data: article };
  }

  // 4. 修改文章
  update(id: number, updateArticleDto: UpdateArticleDto) {
    const articleIndex = this.articles.findIndex((item) => item.id === id);
    if (articleIndex === -1) {
      throw new NotFoundException(`无法修改：ID 为 ${id} 的文章不存在！`);
    }
    // 把旧数据和新修改的数据合并
    this.articles[articleIndex] = {
      ...this.articles[articleIndex],
      ...updateArticleDto,
    };
    return { message: '修改成功', data: this.articles[articleIndex] };
  }

  // 5. 删除文章
  remove(id: number) {
    const articleIndex = this.articles.findIndex((item) => item.id === id);
    if (articleIndex === -1) {
      throw new NotFoundException(`无法删除：ID 为 ${id} 的文章不存在！`);
    }
    // 从数组中剔除
    const deleted = this.articles.splice(articleIndex, 1);
    return { message: '删除成功', data: deleted[0] };
  }
}
