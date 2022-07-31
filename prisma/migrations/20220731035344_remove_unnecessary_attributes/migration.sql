/*
  Warnings:

  - You are about to drop the column `external_research_id` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `is_external_research` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `external_research_id` on the `ResearchDissemination` table. All the data in the column will be lost.
  - You are about to drop the column `is_external_research` on the `ResearchDissemination` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `ResearchDissemination` table. All the data in the column will be lost.
  - You are about to drop the column `external_research_id` on the `ResearchPresentation` table. All the data in the column will be lost.
  - You are about to drop the column `is_external_research` on the `ResearchPresentation` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `ResearchPresentation` table. All the data in the column will be lost.
  - You are about to drop the `_ExternalResearchToResearchDissemination` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToResearchDissemination` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JournalPublication" DROP CONSTRAINT "JournalPublication_external_research_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalPublication" DROP CONSTRAINT "JournalPublication_project_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPresentation" DROP CONSTRAINT "ResearchPresentation_external_research_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPresentation" DROP CONSTRAINT "ResearchPresentation_project_id_fkey";

-- DropForeignKey
ALTER TABLE "_ExternalResearchToResearchDissemination" DROP CONSTRAINT "_ExternalResearchToResearchDissemination_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExternalResearchToResearchDissemination" DROP CONSTRAINT "_ExternalResearchToResearchDissemination_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToResearchDissemination" DROP CONSTRAINT "_ProjectToResearchDissemination_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToResearchDissemination" DROP CONSTRAINT "_ProjectToResearchDissemination_B_fkey";

-- AlterTable
ALTER TABLE "JournalPublication" DROP COLUMN "external_research_id",
DROP COLUMN "is_external_research",
DROP COLUMN "project_id";

-- AlterTable
ALTER TABLE "ResearchDissemination" DROP COLUMN "external_research_id",
DROP COLUMN "is_external_research",
DROP COLUMN "project_id";

-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "external_research_id",
DROP COLUMN "is_external_research",
DROP COLUMN "project_id";

-- DropTable
DROP TABLE "_ExternalResearchToResearchDissemination";

-- DropTable
DROP TABLE "_ProjectToResearchDissemination";
