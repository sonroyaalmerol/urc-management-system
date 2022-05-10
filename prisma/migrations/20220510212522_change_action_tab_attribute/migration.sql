/*
  Warnings:

  - You are about to drop the column `comment` on the `ActionTag` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActionTag" DROP COLUMN "comment",
ADD COLUMN     "content" TEXT;
