/*
  Warnings:

  - You are about to drop the column `approved` on the `BookPublication` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `ResearchDissemination` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `ResearchEventAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `approved` on the `ResearchPresentation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BookPublication" DROP COLUMN "approved",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "JournalPublication" DROP COLUMN "approved",
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ResearchDissemination" DROP COLUMN "approved";

-- AlterTable
ALTER TABLE "ResearchEventAttendance" DROP COLUMN "approved";

-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "approved";
