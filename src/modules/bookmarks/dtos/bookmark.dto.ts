import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty({ type: 'number' })
  @IsInt()
  postId: number;
}

