import { Module } from '@nestjs/common';
import { FollowAuthorsController } from './controllers/follow-authors.controller';
import { FollowAuthorsService } from './services/follow-authors.service';

@Module({
  controllers: [FollowAuthorsController],
  providers: [FollowAuthorsService],
})
export class FollowAuthorsModule {}

