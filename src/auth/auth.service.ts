import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'; // 💡 引入加密库（如果你装的是 bcryptjs，这里就改写 from 'bcryptjs'）
import { JwtService } from '@nestjs/jwt'; // 💡 注入 NestJS 自带的 JWT 服务

@Injectable()
export class AuthService {
  // 注入数据库小秘书
  // 💡 NestJS 的依赖注入机制会自动把上面这两个服务的实例注入到构造函数里
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // 1. 注册账户
  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;

    // A. 检查账户是否已经存在
    const existUser = await this.prisma.client.dbUser.findUnique({
      where: { username: username },
    });
    if (existUser) {
      throw new BadRequestException('该账号已被注册，请直接登录！');
    }

    // B. 给密码加密
    // 这里的 10 代表加密强度（Salt Rounds），数值越高越安全，但计算越慢，10 是性价比最高的工业标准
    // 💡 注意：bcrypt.hash() 是异步函数，必须加 await
    const hashedPassword = await bcrypt.hash(password, 10);

    // c. 存入数据库
    const newUser = await this.prisma.client.dbUser.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return {
      message: '注册成功！',
      data: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      }, // 💡 良好习惯：返回数据时把密码字段扣掉，不暴露给前端
    };
  }

  // 2. 登录账号并颁发 token
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    console.log('JWT_SECRET', process.env.JWT_SECRET);

    // A. 检查用户是否存在
    const user = await this.prisma.client.dbUser.findUnique({
      where: { username },
    });
    if (!user) throw new BadRequestException('账号或密码错误!'); // 💡 良好安全习惯：不明确告诉黑客是账号不存在还是密码错

    // B. 核对密码是否正确（bcrypt.compare() 也是异步函数）
    // 把前端的明文 password 和数据库里的密文 user.password 进行解密比对
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new BadRequestException('账号或密码错误!');

    // C. 密码正确，制作 门票的内容 （Playload）
    // 注意：里面千万不要塞敏感信息（比如密码），因为 Token 是可以被前端 Base64 解码看出来的
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    // D. 盖章签名，生成一串超长的 Token 字符串
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: '登录成功！',
      data: {
        username: user.username,
        role: user.role,
        token: accessToken, // 💡 这就是前端以后梦寐以求的身份令牌！
      },
    };
  }
}
