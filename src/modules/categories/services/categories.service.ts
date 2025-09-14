import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CategoryFilterDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async findAll(filters: CategoryFilterDto) {
    const { inputSearch, parentId, limit = 50, offset = 0 } = filters;

    const where: Prisma.CategoryWhereInput = {};
    if (parentId !== undefined) where.parentId = parentId;
    if (inputSearch) {
      where.OR = [
        { name: { contains: inputSearch, mode: 'insensitive' } },
        { slug: { contains: inputSearch, mode: 'insensitive' } },
        { description: { contains: inputSearch, mode: 'insensitive' } },
      ];
    }

    const data = await this.prisma.category.findMany({
      where,
      orderBy: { name: 'asc' },
      take: limit,
      skip: offset,
    });
    const total = await this.prisma.category.count({ where });
    return { data, total };
  }

  async findOne(id: number) {
    const res = await this.prisma.category.findUnique({ where: { id } });
    if (!res) throw new BadRequestException('Category not found');
    return res;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
