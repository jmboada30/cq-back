import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTagDto, TagFilterDto, UpdateTagDto } from '../dtos';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    return this.prisma.tag.create({ data: dto });
  }

  async findAll(filters: TagFilterDto) {
    const { inputSearch, limit = 50, offset = 0 } = filters;
    const where: Prisma.TagWhereInput = {};
    if (inputSearch) {
      where.OR = [
        { name: { contains: inputSearch, mode: 'insensitive' } },
        { slug: { contains: inputSearch, mode: 'insensitive' } },
      ];
    }
    const data = await this.prisma.tag.findMany({
      where,
      orderBy: { name: 'asc' },
      take: limit,
      skip: offset,
    });
    const total = await this.prisma.tag.count({ where });
    return { data, total };
  }

  async findOne(id: number) {
    const res = await this.prisma.tag.findUnique({ where: { id } });
    if (!res) throw new BadRequestException('Tag not found');
    return res;
  }

  async update(id: number, dto: UpdateTagDto) {
    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.tag.delete({ where: { id } });
  }
}

