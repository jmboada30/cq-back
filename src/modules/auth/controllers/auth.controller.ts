import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
  Action,
  CheckPolicies,
} from '../../casl/decorators/check-policies.decorator';
import { GetUser, RawHeaders, Auth } from '../decorators';
import { AuthService } from '../services';
import { RegisterUserDto, LoginUserDto } from '../dtos';
import { PoliciesGuard } from '../../casl/guards/policies.guard';
import type { ModelUser } from '../interfaces/model-auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, 'User'))
  create(@Body() createUserDto: RegisterUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiBearerAuth('JWT')
  @Auth()
  @Get('check-auth-token')
  checkAuthToken(@GetUser() user: ModelUser) {
    return this.authService.checkUser(user);
  }

  @Post('check-user-is-admin')
  checkUserIsAdmin(@Body() loginUserDto: LoginUserDto) {
    return this.authService.checkUserIsAdmin(loginUserDto);
  }

  @ApiBearerAuth('JWT')
  @Auth()
  @Get('me')
  private(
    @GetUser() user: ModelUser,
    @GetUser('email') email: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return { user, email, headers: rawHeaders };
  }
}
