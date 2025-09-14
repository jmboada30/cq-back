import { Module } from '@nestjs/common';
import { PostReactionsController } from './controllers/post-reactions.controller';
import { PostReactionsService } from './services/post-reactions.service';

@Module({
  controllers: [PostReactionsController],
  providers: [PostReactionsService],
})
export class PostReactionsModule {}

