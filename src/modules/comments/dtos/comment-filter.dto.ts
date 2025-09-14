import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { CommentStatus } from '@prisma/client';
import { PaginationDto } from 'src/modules/common/dtos/pagination.dto';

export class CommentFilterDto extends PaginationDto {
  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  postId?: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  parentId?: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  authorId?: number;

  @ApiProperty({ required: false, enum: CommentStatus })
  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
}

