/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "discordId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_discordId_key" ON "public"."users"("discordId");
