import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BookmarksService } from '../services/bookmarks.service';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';
import { GetUser } from 'src/modules/auth/decorators';
import { BookmarkFilterDto, CreateBookmarkDto } from '../dtos';

@ApiTags('Bookmarks')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly service: BookmarksService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'Bookmark'))
  create(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
    return this.service.create(userId, dto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'Bookmark'))
  findAll(@Query() filters: BookmarkFilterDto) {
    return this.service.findAll(filters);
  }

  @Delete(':userId/:postId')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'Bookmark'))
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.service.remove(userId, postId);
  }
}

