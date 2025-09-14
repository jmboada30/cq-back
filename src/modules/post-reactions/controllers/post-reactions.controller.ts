import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PostReactionsService } from '../services/post-reactions.service';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';
import { GetUser } from 'src/modules/auth/decorators';
import { CreatePostReactionDto, PostReactionFilterDto } from '../dtos';

@ApiTags('PostReactions')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('post-reactions')
export class PostReactionsController {
  constructor(private readonly service: PostReactionsService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'PostReaction'))
  react(@GetUser('id') userId: number, @Body() dto: CreatePostReactionDto) {
    return this.service.react(userId, dto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'PostReaction'))
  findAll(@Query() filters: PostReactionFilterDto) {
    return this.service.findAll(filters);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'PostReaction'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

