import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CommentFilterDto, CreateCommentDto, UpdateCommentDto } from '../dtos';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: number, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        post: { connect: { id: dto.postId } },
        author: { connect: { id: authorId } },
        parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
        content: dto.content,
        status: dto.status,
      },
    });
  }

  async findAll(filters: CommentFilterDto) {
    const { postId, parentId, authorId, status, limit = 50, offset = 0 } = filters;
    const where: Prisma.CommentWhereInput = {};
    if (postId) where.postId = postId;
    if (parentId) where.parentId = parentId;
    if (authorId) where.authorId = authorId;
    if (status) where.status = status;

    const data = await this.prisma.comment.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
      take: limit,
      skip: offset,
    });
    const total = await this.prisma.comment.count({ where });
    return { data, total };
  }

  async findOne(id: number) {
    const res = await this.prisma.comment.findUnique({ where: { id } });
    if (!res) throw new BadRequestException('Comment not found');
    return res;
  }

  async update(id: number, dto: UpdateCommentDto) {
    const data: Prisma.CommentUpdateInput = {
      content: dto.content,
      status: dto.status,
      parent: dto.parentId ? { connect: { id: dto.parentId } } : undefined,
    };
    return this.prisma.comment.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.comment.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

