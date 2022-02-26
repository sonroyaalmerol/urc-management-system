/*
  Warnings:

  - You are about to drop the column `slug` on the `ResearchPresentation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "slug",
ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "conference" TEXT,
ADD COLUMN     "presentor" TEXT,
ADD COLUMN     "url" TEXT;
