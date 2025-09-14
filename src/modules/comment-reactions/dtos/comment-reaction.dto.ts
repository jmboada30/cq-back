import { ApiProperty } from '@nestjs/swagger';
import { ReactionType } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class CreateCommentReactionDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  commentId: number;

  @ApiProperty({ enum: ReactionType })
  @IsEnum(ReactionType)
  type: ReactionType;
}

