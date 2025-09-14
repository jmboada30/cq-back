import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CommentStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  postId: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false, enum: CommentStatus })
  @IsOptional()
  @IsEnum(CommentStatus)
  status?: CommentStatus;
}

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}

