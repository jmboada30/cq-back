import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { BookmarkFilterDto, CreateBookmarkDto } from '../dtos';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateBookmarkDto) {
    return this.prisma.bookmark.upsert({
      where: { userId_postId: { userId, postId: dto.postId } },
      create: { userId, postId: dto.postId },
      update: {},
    });
  }

  async findAll(filters: BookmarkFilterDto) {
    const { userId, postId, limit = 50, offset = 0 } = filters;
    const where: Prisma.BookmarkWhereInput = {};
    if (userId) where.userId = userId;
    if (postId) where.postId = postId;

    const data = await this.prisma.bookmark.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
    const total = await this.prisma.bookmark.count({ where });
    return { data, total };
  }

  async remove(userId: number, postId: number) {
    return this.prisma.bookmark.delete({ where: { userId_postId: { userId, postId } } });
  }
}

