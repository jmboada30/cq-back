import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compareData, encryptData } from '../../common/utils/encryptData';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ModelUser } from '../interfaces/model-auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: RegisterUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = await this.prismaService.user.create({
        data: {
          ...userData,
          email: createUserDto.email.toLowerCase(),
          password: await encryptData(password),
        },
        select: {
          id: true,
          email: true,
          roles: true,
          isActive: true,
        },
      });

      return { ...user, jwt: this.getJsonWebToken({ uid: user.id }) };
    } catch (error) {
      this.handleError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const email = loginUserDto.email.toLowerCase();
    const password = loginUserDto.password;

    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        roles: true,
        isActive: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('Credentials invalid');

    const isCorrectPassword = await compareData(password, user.password);

    if (!isCorrectPassword)
      throw new UnauthorizedException('Credentials are not valid');

    delete (user as ModelUser)?.password;

    return { ...user, jwt: this.getJsonWebToken({ uid: user.id }) };
  }

  async checkUserIsAdmin(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        roles: true,
        isActive: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('Credentials invalid');

    if (!compareData(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    delete (user as ModelUser)?.password;

    if (!user.roles.includes('admin'))
      throw new UnauthorizedException('User is not an admin');

    return { isAuthorized: true };
  }

  async checkUser(user: ModelUser) {
    delete user?.password;
    return { ...user, jwt: this.getJsonWebToken({ uid: user.id }) };
  }

  private getJsonWebToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleError(error: any): never {
    if (error.errno === 19) throw new BadRequestException(error.message);

    console.log(error);

    throw new InternalServerErrorException('Something went wrong');
  }
}
