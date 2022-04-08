/*
  Warnings:

  - You are about to drop the column `user_id` on the `BookPublication` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ResearchDissemination` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `ResearchPresentation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookPublication" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "JournalPublication" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "ResearchDissemination" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "user_id";
