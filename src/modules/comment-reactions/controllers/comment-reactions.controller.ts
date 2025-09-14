import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentReactionsService } from '../services/comment-reactions.service';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';
import { GetUser } from 'src/modules/auth/decorators';
import { CommentReactionFilterDto, CreateCommentReactionDto } from '../dtos';

@ApiTags('CommentReactions')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('comment-reactions')
export class CommentReactionsController {
  constructor(private readonly service: CommentReactionsService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'CommentReaction'))
  react(@GetUser('id') userId: number, @Body() dto: CreateCommentReactionDto) {
    return this.service.react(userId, dto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'CommentReaction'))
  findAll(@Query() filters: CommentReactionFilterDto) {
    return this.service.findAll(filters);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'CommentReaction'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

