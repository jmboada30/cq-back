import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ReactionType } from '@prisma/client';
import { PaginationDto } from 'src/modules/common/dtos/pagination.dto';

export class CommentReactionFilterDto extends PaginationDto {
  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  commentId?: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @ApiProperty({ required: false, enum: ReactionType })
  @IsOptional()
  @IsEnum(ReactionType)
  type?: ReactionType;
}

