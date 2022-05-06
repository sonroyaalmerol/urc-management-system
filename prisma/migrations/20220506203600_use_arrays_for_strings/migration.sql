/*
  Warnings:

  - The `authors` column on the `BookPublication` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `main_proponents` column on the `ExternalResearch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `co_proponents` column on the `ExternalResearch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `authors` column on the `JournalPublication` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `event_title` on the `ResearchPresentation` table. All the data in the column will be lost.
  - You are about to drop the column `presentor` on the `ResearchPresentation` table. All the data in the column will be lost.
  - The `main_proponents` column on the `URCFundedResearch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `co_proponents` column on the `URCFundedResearch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `BookPublication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[short_name]` on the table `Institute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `InstituteNews` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `JournalPublication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ResearchDissemination` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `ResearchPresentation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ResearchPresentation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `URCFundedResearch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `ResearchPresentation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ResearchPresentation_event_title_key";

-- AlterTable
ALTER TABLE "BookPublication" DROP COLUMN "authors",
ADD COLUMN     "authors" TEXT[],
ALTER COLUMN "date_published" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ExternalResearch" DROP COLUMN "main_proponents",
ADD COLUMN     "main_proponents" TEXT[],
DROP COLUMN "co_proponents",
ADD COLUMN     "co_proponents" TEXT[];

-- AlterTable
ALTER TABLE "InstituteNews" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "JournalPublication" DROP COLUMN "authors",
ADD COLUMN     "authors" TEXT[];

-- AlterTable
ALTER TABLE "ResearchDissemination" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "event_title",
DROP COLUMN "presentor",
ADD COLUMN     "presentors" TEXT[],
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "URCFundedResearch" ADD COLUMN     "abstract" TEXT,
ADD COLUMN     "completed_at" TEXT,
ADD COLUMN     "keywords" TEXT[],
DROP COLUMN "main_proponents",
ADD COLUMN     "main_proponents" TEXT[],
DROP COLUMN "co_proponents",
ADD COLUMN     "co_proponents" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "BookPublication_slug_key" ON "BookPublication"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Institute_short_name_key" ON "Institute"("short_name");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteNews_slug_key" ON "InstituteNews"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "JournalPublication_slug_key" ON "JournalPublication"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchDissemination_slug_key" ON "ResearchDissemination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchPresentation_title_key" ON "ResearchPresentation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchPresentation_slug_key" ON "ResearchPresentation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "URCFundedResearch_slug_key" ON "URCFundedResearch"("slug");
