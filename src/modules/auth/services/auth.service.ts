import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Profile } from 'passport-discord'

import { compareData, encryptData } from '../../common/utils/encryptData';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ModelUser } from '../interfaces/model-auth.interface';

const DEFAULT_USER_PROFILE_ID = 2;
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: RegisterUserDto) {
    try {
      const { password,profileId, ...userData } = createUserDto;

      const user = await this.prismaService.user.create({
        data: {
          ...userData,
          slug:'',
          email: createUserDto.email.toLowerCase(),
          password: await encryptData(password),
          Profile:{
            connect:{
              id: profileId || DEFAULT_USER_PROFILE_ID
            }
          }
        },
        select: {
          id: true,
          email: true,
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
        isActive: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('Credentials invalid');

    if (!user.password)
      throw new UnauthorizedException(
        'This account can only be accessed through a social provider.',
      );

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
       
        isActive: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException('Credentials invalid');

    if (!compareData(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    delete (user as ModelUser)?.password;


    return { isAuthorized: true };
  }

  async checkUser(user: ModelUser) {
    delete user?.password;
    return { ...user, jwt: this.getJsonWebToken({ uid: user.id }) };
  }

  public getJsonWebToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleError(error: any): never {
    if (error.errno === 19) throw new BadRequestException(error.message);

    console.log(error);

    throw new InternalServerErrorException('Something went wrong');
  }

  async validateDiscordUser(profile: Profile) {
    const { id: providerId, email, avatar, username } = profile;
    const provider = 'discord';

    // 1. Busca si ya existe una cuenta social con este proveedor y ID
    const socialAccount = await this.prismaService.socialAccount.findUnique({
      where: {
        provider_providerId: { provider, providerId },
      },
      include: {
        user: {
          include: {
            Profile: { include: { Permissions: true } },
          },
        },
      },
    });

    if (socialAccount) {
      // Si la cuenta social existe, devuelve el usuario asociado
      return socialAccount.user;
    }

    // 2. Si no, busca si ya existe un usuario con ese email para vincular la cuenta
    if (email) {
      const userByEmail = await this.prismaService.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { Profile: { include: { Permissions: true } } },
      });

      if (userByEmail) {
        // El usuario existe, así que solo creamos y vinculamos la nueva cuenta social
        await this.prismaService.socialAccount.create({
          data: {
            provider,
            providerId,
            avatar,
            userId: userByEmail.id,
          },
        });
        return userByEmail;
      }
    }

    // 3. Si no existe de ninguna forma, creamos un nuevo usuario Y su cuenta social vinculada
    const newUser = await this.prismaService.user.create({
      data: {
        email: email.toLowerCase(),
        name: username,
        slug: '',
        // La contraseña es nula, solo podrá loguearse con Discord
        isActive: true,
        Profile: { connect: { id: DEFAULT_USER_PROFILE_ID } },
        SocialAccounts: {
          create: {
            provider,
            providerId,
            avatar,
          },
        },
      },
      include: {
        Profile: { include: { Permissions: true } },
      },
    });

    return newUser;
  }
}
