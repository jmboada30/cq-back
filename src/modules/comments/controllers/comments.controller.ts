import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post as PostMethod,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from '../services/comments.service';
import { CommentFilterDto, CreateCommentDto, UpdateCommentDto } from '../dtos';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';
import { GetUser } from 'src/modules/auth/decorators';

@ApiTags('Comments')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @PostMethod()
  @CheckPolicies((ability) => ability.can(Action.Create, 'Comment'))
  create(@GetUser('id') userId: number, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(userId, dto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'Comment'))
  findAll(@Query() filters: CommentFilterDto) {
    return this.commentsService.findAll(filters);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, 'Comment'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.Update, 'Comment'))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'Comment'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}

