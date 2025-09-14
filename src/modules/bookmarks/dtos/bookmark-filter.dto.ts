import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/modules/common/dtos/pagination.dto';

export class BookmarkFilterDto extends PaginationDto {
  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  postId?: number;
}

