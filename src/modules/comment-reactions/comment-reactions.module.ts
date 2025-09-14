import { Module } from '@nestjs/common';
import { CommentReactionsController } from './controllers/comment-reactions.controller';
import { CommentReactionsService } from './services/comment-reactions.service';

@Module({
  controllers: [CommentReactionsController],
  providers: [CommentReactionsService],
})
export class CommentReactionsModule {}

