/*
  Warnings:

  - You are about to drop the column `authors` on the `BookPublication` table. All the data in the column will be lost.
  - You are about to drop the column `authors` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `presentors` on the `ResearchPresentation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookPublication" DROP COLUMN "authors";

-- AlterTable
ALTER TABLE "JournalPublication" DROP COLUMN "authors";

-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "presentors";
