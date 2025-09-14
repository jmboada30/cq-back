import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '@prisma/client';
import { PaginationDto } from 'src/modules/common/dtos/pagination.dto';

export class PostFilterDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  inputSearch?: string;

  @ApiProperty({ required: false, enum: PostStatus })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  authorId?: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  tagId?: number;
}

