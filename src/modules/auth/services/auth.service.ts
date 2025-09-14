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

  public getJsonWebToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private handleError(error: any): never {
    if (error.errno === 19) throw new BadRequestException(error.message);

    console.log(error);

    throw new InternalServerErrorException('Something went wrong');
  }

  async validateDiscordUser(profile: Profile) {
    const { id: discordId, email, avatar, username } = profile;

    // 1. Buscar si el usuario ya existe por su discordId
    let user = await this.prismaService.user.findUnique({
      where: { discordId },
      include: { Profile: { include: { Permissions: true } } }, // Incluimos perfil y permisos para CASL
    });

    if (user) {
      return user; // Si existe, lo retornamos
    }

    // 2. Si no, buscar si existe un usuario con ese email para vincular la cuenta
    if (email) {
      const userByEmail = await this.prismaService.user.findUnique({ where: { email } });
      if (userByEmail) {
        // Vinculamos la cuenta de Discord y retornamos el usuario
        return this.prismaService.user.update({
          where: { email },
          data: { discordId, avatar },
          include: { Profile: { include: { Permissions: true } } },
        });
      }
    }

    // 3. Si no existe de ninguna forma, creamos un nuevo usuario
    // OJO: La contraseña es nula, este usuario solo podrá loguearse con Discord.
    // Asignamos un perfil por defecto a los nuevos usuarios. Debes tener uno creado.
    const newUser = await this.prismaService.user.create({
      data: {
        discordId,
        email: email.toLowerCase(),
        name: username,
        avatar,
        password: '', // O un valor aleatorio seguro si tu schema lo requiere como no-nulo
        isActive: true,
        // Asignar un perfil por defecto es crucial para los permisos con CASL
        Profile: { connect: { id: DEFAULT_USER_PROFILE_ID } },
      },
      include: { Profile: { include: { Permissions: true } } },
    });

    return newUser;
  }
}
