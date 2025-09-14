/*
  Warnings:

  - You are about to drop the column `createdAt` on the `social_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `social_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `social_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `roles` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider_id]` on the table `social_accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_id` to the `social_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `social_accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `social_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."social_accounts" DROP CONSTRAINT "social_accounts_userId_fkey";

-- DropIndex
DROP INDEX "public"."social_accounts_provider_providerId_key";

-- AlterTable
ALTER TABLE "public"."social_accounts" DROP COLUMN "createdAt",
DROP COLUMN "providerId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "provider_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "roles";

-- CreateTable
CREATE TABLE "public"."setting_user" (
    "id" SERIAL NOT NULL,
    "time_zone" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "setting_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_provider_provider_id_key" ON "public"."social_accounts"("provider", "provider_id");

-- AddForeignKey
ALTER TABLE "public"."setting_user" ADD CONSTRAINT "setting_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."social_accounts" ADD CONSTRAINT "social_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
