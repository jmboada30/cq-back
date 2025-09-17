import { Injectable } from '@nestjs/common';
import { Prisma, ReactionType } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreatePostReactionDto } from '../dtos/post-reaction.dto';
import { PostReactionFilterDto } from '../dtos';

@Injectable()
export class PostReactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async react(userId: number, dto: CreatePostReactionDto) {
    // upsert per (postId, userId, type)
    return this.prisma.postReaction.upsert({
      where: {
        postId_userId_type: {
          postId: dto.postId,
          userId,
          type: dto.type,
        },
      },
      create: { postId: dto.postId, userId, type: dto.type },
      update: {},
    });
  }

  async findAll(filters: PostReactionFilterDto) {
    const { postId, userId, type, limit = 50, offset = 0 } = filters;
    const where: Prisma.PostReactionWhereInput = {};
    if (postId) where.postId = postId;
    if (userId) where.userId = userId;
    if (type) where.type = type as ReactionType;

    const data = await this.prisma.postReaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        user:true
      } 
    });
    const total = await this.prisma.postReaction.count({ where });
    return { data, total };
  }

  async remove(id: number) {
    return this.prisma.postReaction.delete({ where: { id } });
  }
}

