import { Injectable } from '@nestjs/common';
import { Prisma, ReactionType } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CommentReactionFilterDto, CreateCommentReactionDto } from '../dtos';

@Injectable()
export class CommentReactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async react(userId: number, dto: CreateCommentReactionDto) {
    return this.prisma.commentReaction.upsert({
      where: {
        commentId_userId_type: {
          commentId: dto.commentId,
          userId,
          type: dto.type,
        },
      },
      create: { commentId: dto.commentId, userId, type: dto.type },
      update: {},
    });
  }

  async findAll(filters: CommentReactionFilterDto) {
    const { commentId, userId, type, limit = 50, offset = 0 } = filters;
    const where: Prisma.CommentReactionWhereInput = {};
    if (commentId) where.commentId = commentId;
    if (userId) where.userId = userId;
    if (type) where.type = type as ReactionType;

    const data = await this.prisma.commentReaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include:{
        user:true
      }
    });
    const total = await this.prisma.commentReaction.count({ where });
    return { data, total };
  }

  async remove(id: number) {
    return this.prisma.commentReaction.delete({ where: { id } });
  }
}

