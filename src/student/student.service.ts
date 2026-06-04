import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStudentDto: CreateStudentDto) {
    const newStudent = await this.prisma.client.dbStudent.create({
      data: {
        name: createStudentDto.name,
        address: createStudentDto.address,
        tags: createStudentDto.tags,
        age: createStudentDto.age,
      },
    });
    return { message: '创建成功', data: newStudent };
  }

  async findAll() {
    const students = await this.prisma.client.dbStudent.findMany();
    return { message: '查询成功', data: students };
  }

  async findOne(id: number) {
    const student = await this.prisma.client.dbStudent.findUnique({
      where: { id: id },
    });
    if (!student) {
      // NestJS 内置的错误处理，会自动返回 404 状态码
      throw new NotFoundException(`ID 为 ${id} 的文章不存在！`);
    }
    return { message: '查询成功', data: student };
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    // 先查在不在，不在直接触发上面的 404 报错
    await this.findOne(id);

    const updatedStudent = await this.prisma.client.dbStudent.update({
      where: { id: id },
      data: updateStudentDto, // Prisma 非常智能，前端没传的字段会自动忽略不改
    });
    return { message: '修改成功', data: updatedStudent };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.client.dbStudent.delete({ where: { id: id } });
    return { message: '删除成功', data: null };
  }
}
