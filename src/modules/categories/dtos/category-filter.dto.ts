import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/modules/common/dtos/pagination.dto';

export class CategoryFilterDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  inputSearch?: string;

  @ApiProperty({ required: false, type: 'number' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  parentId?: number;
}

