import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class FollowAuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async follow(followerId: number, followingId: number) {
    return this.prisma.followAuthor.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    });
  }

  async unfollow(followerId: number, followingId: number) {
    return this.prisma.followAuthor.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
  }

  async followers(userId: number) {
    const data = await this.prisma.followAuthor.findMany({
      where: { followingId: userId },
      select: { followerId: true },
    });
    return { data, total: data.length };
  }

  async following(userId: number) {
    const data = await this.prisma.followAuthor.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    return { data, total: data.length };
  }
}

