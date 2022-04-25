/*
  Warnings:

  - You are about to drop the column `is_approved` on the `URCFundedResearch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ResearchDissemination" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ResearchEventAttendance" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ResearchPresentation" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "URCFundedResearch" DROP COLUMN "is_approved",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false;
