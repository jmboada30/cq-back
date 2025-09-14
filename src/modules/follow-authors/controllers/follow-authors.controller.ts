import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FollowAuthorsService } from '../services/follow-authors.service';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';
import { GetUser } from 'src/modules/auth/decorators';

@ApiTags('FollowAuthors')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('follow-authors')
export class FollowAuthorsController {
  constructor(private readonly service: FollowAuthorsService) {}

  @Post(':followingId')
  @CheckPolicies((ability) => ability.can(Action.Create, 'FollowAuthor'))
  follow(
    @GetUser('id') followerId: number,
    @Param('followingId', ParseIntPipe) followingId: number,
  ) {
    return this.service.follow(followerId, followingId);
  }

  @Delete(':followingId')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'FollowAuthor'))
  unfollow(
    @GetUser('id') followerId: number,
    @Param('followingId', ParseIntPipe) followingId: number,
  ) {
    return this.service.unfollow(followerId, followingId);
  }

  @Get('followers/:userId')
  @CheckPolicies((ability) => ability.can(Action.Read, 'FollowAuthor'))
  followers(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.followers(userId);
  }

  @Get('following/:userId')
  @CheckPolicies((ability) => ability.can(Action.Read, 'FollowAuthor'))
  following(@Param('userId', ParseIntPipe) userId: number) {
    return this.service.following(userId);
  }
}

