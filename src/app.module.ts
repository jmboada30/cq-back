import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CommonModule } from './modules/common/common.module';
import { SharedModule } from './modules/shared/shared.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/casl/casl.module';
import { MenuItemsModule } from './modules/menu-items/menu-items.module';
import { DropDownsModule } from './modules/drop-downs/drop-downs.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { PostsModule } from './modules/posts/posts.module';
import { CommentsModule } from './modules/comments/comments.module';
import { PostReactionsModule } from './modules/post-reactions/post-reactions.module';
import { CommentReactionsModule } from './modules/comment-reactions/comment-reactions.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { FollowAuthorsModule } from './modules/follow-authors/follow-authors.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CommonModule,
    SharedModule,
    PrismaModule,
    AuthModule,
    CaslModule,
    MenuItemsModule,
    DropDownsModule,
    ProfilesModule,
    CategoriesModule,
    TagsModule,
    PostsModule,
    CommentsModule,
    PostReactionsModule,
    CommentReactionsModule,
    BookmarksModule,
    FollowAuthorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
