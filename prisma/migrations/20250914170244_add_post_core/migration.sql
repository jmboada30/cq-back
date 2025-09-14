-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."CommentStatus" AS ENUM ('VISIBLE', 'HIDDEN', 'DELETED', 'PENDING');

-- CreateEnum
CREATE TYPE "public"."ReactionType" AS ENUM ('LIKE', 'LOVE', 'LAUGH', 'WOW', 'SAD', 'ANGRY');

-- CreateTable
CREATE TABLE "public"."blog_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parent_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_posts" (
    "id" SERIAL NOT NULL,
    "author_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content_md" TEXT,
    "content_json" JSONB,
    "cover_image_url" TEXT,
    "status" "public"."PostStatus" NOT NULL DEFAULT 'DRAFT',
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "scheduled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "like_count" INTEGER NOT NULL DEFAULT 0,
    "comment_count" INTEGER NOT NULL DEFAULT 0,
    "reading_time_min" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_post_categories" (
    "post_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_categories_pkey" PRIMARY KEY ("post_id","category_id")
);

-- CreateTable
CREATE TABLE "public"."blog_post_tags" (
    "post_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_tags_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."blog_comments" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "parent_id" INTEGER,
    "content" TEXT NOT NULL,
    "status" "public"."CommentStatus" NOT NULL DEFAULT 'VISIBLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "userId" INTEGER,

    CONSTRAINT "blog_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_post_reactions" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "public"."ReactionType" NOT NULL DEFAULT 'LIKE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_comment_reactions" (
    "id" SERIAL NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "public"."ReactionType" NOT NULL DEFAULT 'LIKE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_comment_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_bookmarks" (
    "user_id" INTEGER NOT NULL,
    "post_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_bookmarks_pkey" PRIMARY KEY ("user_id","post_id")
);

-- CreateTable
CREATE TABLE "public"."blog_follow_authors" (
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_follow_authors_pkey" PRIMARY KEY ("follower_id","following_id")
);

-- CreateTable
CREATE TABLE "public"."blog_post_edit_history" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "editor_id" INTEGER,
    "title" TEXT,
    "excerpt" TEXT,
    "content_md" TEXT,
    "content_json" JSONB,
    "edited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "blog_post_edit_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."blog_post_views" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "ip_hash" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blog_post_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_name_key" ON "public"."blog_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_categories_slug_key" ON "public"."blog_categories"("slug");

-- CreateIndex
CREATE INDEX "blog_categories_parent_id_idx" ON "public"."blog_categories"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_name_key" ON "public"."blog_tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_key" ON "public"."blog_tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "public"."blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_author_id_idx" ON "public"."blog_posts"("author_id");

-- CreateIndex
CREATE INDEX "blog_posts_status_published_at_idx" ON "public"."blog_posts"("status", "published_at");

-- CreateIndex
CREATE INDEX "blog_posts_is_pinned_idx" ON "public"."blog_posts"("is_pinned");

-- CreateIndex
CREATE INDEX "blog_post_categories_category_id_idx" ON "public"."blog_post_categories"("category_id");

-- CreateIndex
CREATE INDEX "blog_post_tags_tag_id_idx" ON "public"."blog_post_tags"("tag_id");

-- CreateIndex
CREATE INDEX "blog_comments_post_id_idx" ON "public"."blog_comments"("post_id");

-- CreateIndex
CREATE INDEX "blog_comments_author_id_idx" ON "public"."blog_comments"("author_id");

-- CreateIndex
CREATE INDEX "blog_comments_parent_id_idx" ON "public"."blog_comments"("parent_id");

-- CreateIndex
CREATE INDEX "blog_comments_status_idx" ON "public"."blog_comments"("status");

-- CreateIndex
CREATE INDEX "blog_post_reactions_user_id_idx" ON "public"."blog_post_reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_post_reactions_post_id_user_id_type_key" ON "public"."blog_post_reactions"("post_id", "user_id", "type");

-- CreateIndex
CREATE INDEX "blog_comment_reactions_user_id_idx" ON "public"."blog_comment_reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_comment_reactions_comment_id_user_id_type_key" ON "public"."blog_comment_reactions"("comment_id", "user_id", "type");

-- CreateIndex
CREATE INDEX "blog_bookmarks_post_id_idx" ON "public"."blog_bookmarks"("post_id");

-- CreateIndex
CREATE INDEX "blog_follow_authors_following_id_idx" ON "public"."blog_follow_authors"("following_id");

-- CreateIndex
CREATE INDEX "blog_post_edit_history_post_id_idx" ON "public"."blog_post_edit_history"("post_id");

-- CreateIndex
CREATE INDEX "blog_post_edit_history_editor_id_idx" ON "public"."blog_post_edit_history"("editor_id");

-- CreateIndex
CREATE INDEX "blog_post_views_post_id_idx" ON "public"."blog_post_views"("post_id");

-- CreateIndex
CREATE INDEX "blog_post_views_user_id_idx" ON "public"."blog_post_views"("user_id");

-- AddForeignKey
ALTER TABLE "public"."blog_categories" ADD CONSTRAINT "blog_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_posts" ADD CONSTRAINT "blog_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_categories" ADD CONSTRAINT "blog_post_categories_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_categories" ADD CONSTRAINT "blog_post_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_tags" ADD CONSTRAINT "blog_post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_tags" ADD CONSTRAINT "blog_post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."blog_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comments" ADD CONSTRAINT "blog_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comments" ADD CONSTRAINT "blog_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comments" ADD CONSTRAINT "blog_comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comments" ADD CONSTRAINT "blog_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_reactions" ADD CONSTRAINT "blog_post_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_reactions" ADD CONSTRAINT "blog_post_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comment_reactions" ADD CONSTRAINT "blog_comment_reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."blog_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_comment_reactions" ADD CONSTRAINT "blog_comment_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_bookmarks" ADD CONSTRAINT "blog_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_bookmarks" ADD CONSTRAINT "blog_bookmarks_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_follow_authors" ADD CONSTRAINT "blog_follow_authors_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_follow_authors" ADD CONSTRAINT "blog_follow_authors_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_edit_history" ADD CONSTRAINT "blog_post_edit_history_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_edit_history" ADD CONSTRAINT "blog_post_edit_history_editor_id_fkey" FOREIGN KEY ("editor_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_views" ADD CONSTRAINT "blog_post_views_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."blog_post_views" ADD CONSTRAINT "blog_post_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
