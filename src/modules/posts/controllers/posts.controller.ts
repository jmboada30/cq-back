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
import { PostsService } from '../services/posts.service';
import { CreatePostDto, PostFilterDto, UpdatePostDto } from '../dtos';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';
import { GetUser } from 'src/modules/auth/decorators';

@ApiTags('Posts')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @PostMethod()
  @CheckPolicies((ability) => ability.can(Action.Create, 'Post'))
  create(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'Post'))
  findAll(@Query() filters: PostFilterDto) {
    return this.postsService.findAll(filters);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, 'Post'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.Update, 'Post'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'Post'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}

