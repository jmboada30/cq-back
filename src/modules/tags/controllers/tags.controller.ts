import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from '../services/tags.service';
import { CreateTagDto, TagFilterDto, UpdateTagDto } from '../dtos';
import { PoliciesGuard } from 'src/modules/casl/guards';
import { Action, CheckPolicies } from 'src/modules/casl/decorators';

@ApiTags('Tags')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'Tag'))
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'Tag'))
  findAll(@Query() filters: TagFilterDto) {
    return this.tagsService.findAll(filters);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, 'Tag'))
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies((ability) => ability.can(Action.Update, 'Tag'))
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(id, dto);
  }

  @Delete(':id')
  @CheckPolicies((ability) => ability.can(Action.Delete, 'Tag'))
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }
}

