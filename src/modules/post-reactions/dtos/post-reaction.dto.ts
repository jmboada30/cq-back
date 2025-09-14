import { ApiProperty } from '@nestjs/swagger';
import { ReactionType } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class CreatePostReactionDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  postId: number;

  @ApiProperty({ enum: ReactionType })
  @IsEnum(ReactionType)
  type: ReactionType;
}

