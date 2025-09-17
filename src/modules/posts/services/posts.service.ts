import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PostStatus } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreatePostDto, PostFilterDto, UpdatePostDto } from '../dtos';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: number, dto: CreatePostDto) {
    const data: Prisma.PostCreateInput = {
      author: { connect: { id: authorId } },
      title: dto.title,
      slug: dto.slug,
      excerpt: dto.excerpt,
      contentMd: dto.contentMd,
      contentJson: dto.contentJson ? (JSON.parse(dto.contentJson) as any) : undefined,
      coverImageUrl: dto.coverImageUrl,
      status: dto.status ?? PostStatus.DRAFT,
      isPinned: dto.isPinned ?? false,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
    };
    return this.prisma.post.create({ data });
  }

  async findAll(filters: PostFilterDto) {
    const { inputSearch, status, authorId, categoryId, tagId, limit = 50, offset = 0 } = filters;
    const where: Prisma.PostWhereInput = {};
    if (status) where.status = status;
    if (authorId) where.authorId = authorId;
    if (categoryId)
      where.categories = { some: { categoryId } };
    if (tagId)
      where.tags = { some: { tagId } };
    if (inputSearch)
      where.title = { contains: inputSearch, mode: 'insensitive' };

    const data = await this.prisma.post.findMany({
      where,
      orderBy: [{ isPinned: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: limit,
      skip: offset,
      include:{
        author:true
      }
    });
    const total = await this.prisma.post.count({ where });
    return { data, total };
  }

  async findOne(id: number) {
    const res = await this.prisma.post.findUnique({ where: { id }, include: {
      author:true
    } });
    if (!res) throw new BadRequestException('Post not found');
    return res;
  }

  async update(id: number, dto: UpdatePostDto) {
    const data: Prisma.PostUpdateInput = {
      title: dto.title,
      slug: dto.slug,
      excerpt: dto.excerpt,
      contentMd: dto.contentMd,
      contentJson: dto.contentJson ? (JSON.parse(dto.contentJson) as any) : undefined,
      coverImageUrl: dto.coverImageUrl,
      status: dto.status,
      isPinned: dto.isPinned,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
    };
    return this.prisma.post.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.post.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

