/*
  Warnings:

  - You are about to drop the column `requirement_id` on the `CapsuleProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `research_status_id` on the `ExternalResearch` table. All the data in the column will be lost.
  - You are about to drop the column `requirement_id` on the `FullBlownProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `urc_funded_research_id` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `urc_funded_research_id` on the `ResearchDissemination` table. All the data in the column will be lost.
  - You are about to drop the column `urc_funded_research_id` on the `ResearchPresentation` table. All the data in the column will be lost.
  - You are about to drop the `CapsuleProposalRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FullBlownProposalRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearchStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `URCFundedResearch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserToURCFundedResearchBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ResearchDisseminationToURCFundedResearch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_URCFundedResearchToUnit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `project_id` to the `CapsuleProposalSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_id` to the `FullBlownProposalSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_title` to the `UserToResearchPresentationBridge` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CapsuleProposalRequirement" DROP CONSTRAINT "CapsuleProposalRequirement_research_id_fkey";

-- DropForeignKey
ALTER TABLE "CapsuleProposalSubmission" DROP CONSTRAINT "CapsuleProposalSubmission_requirement_id_fkey";

-- DropForeignKey
ALTER TABLE "Deliverable" DROP CONSTRAINT "Deliverable_research_id_fkey";

-- DropForeignKey
ALTER TABLE "ExternalResearch" DROP CONSTRAINT "ExternalResearch_research_status_id_fkey";

-- DropForeignKey
ALTER TABLE "FullBlownProposalRequirement" DROP CONSTRAINT "FullBlownProposalRequirement_research_id_fkey";

-- DropForeignKey
ALTER TABLE "FullBlownProposalSubmission" DROP CONSTRAINT "FullBlownProposalSubmission_requirement_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalPublication" DROP CONSTRAINT "JournalPublication_urc_funded_research_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPresentation" DROP CONSTRAINT "ResearchPresentation_urc_funded_research_id_fkey";

-- DropForeignKey
ALTER TABLE "RevisionRequirement" DROP CONSTRAINT "revision_requirement_research_id_fkey";

-- DropForeignKey
ALTER TABLE "URCFundedResearch" DROP CONSTRAINT "URCFundedResearch_research_status_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToURCFundedResearchBridge" DROP CONSTRAINT "user_to_research_research_id_fkey";

-- DropForeignKey
ALTER TABLE "UserToURCFundedResearchBridge" DROP CONSTRAINT "UserToURCFundedResearchBridge_user_id_fkey";

-- DropForeignKey
ALTER TABLE "_ResearchDisseminationToURCFundedResearch" DROP CONSTRAINT "_ResearchDisseminationToURCFundedResearch_A_fkey";

-- DropForeignKey
ALTER TABLE "_ResearchDisseminationToURCFundedResearch" DROP CONSTRAINT "_ResearchDisseminationToURCFundedResearch_B_fkey";

-- DropForeignKey
ALTER TABLE "_URCFundedResearchToUnit" DROP CONSTRAINT "_URCFundedResearchToUnit_A_fkey";

-- DropForeignKey
ALTER TABLE "_URCFundedResearchToUnit" DROP CONSTRAINT "_URCFundedResearchToUnit_B_fkey";

-- DropIndex
DROP INDEX "CapsuleProposalSubmission_requirement_id_key";

-- DropIndex
DROP INDEX "FullBlownProposalSubmission_requirement_id_key";

-- AlterTable
ALTER TABLE "CapsuleProposalSubmission" DROP COLUMN "requirement_id",
ADD COLUMN     "project_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExternalResearch" DROP COLUMN "research_status_id",
ADD COLUMN     "project_status_id" TEXT NOT NULL DEFAULT E'not_implemented';

-- AlterTable
ALTER TABLE "FullBlownProposalSubmission" DROP COLUMN "requirement_id",
ADD COLUMN     "project_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JournalPublication" DROP COLUMN "urc_funded_research_id",
ADD COLUMN     "project_id" TEXT;

-- AlterTable
ALTER TABLE "ResearchDissemination" DROP COLUMN "urc_funded_research_id",
ADD COLUMN     "project_id" TEXT;

-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "urc_funded_research_id",
ADD COLUMN     "project_id" TEXT;

-- AlterTable
ALTER TABLE "UserToBookPublicationBridge" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role_title" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserToInstituteBridge" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserToJournalPublicationBridge" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role_title" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserToResearchDisseminationBridge" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role_title" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserToResearchPresentationBridge" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role_title" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "CapsuleProposalRequirement";

-- DropTable
DROP TABLE "FullBlownProposalRequirement";

-- DropTable
DROP TABLE "ResearchStatus";

-- DropTable
DROP TABLE "URCFundedResearch";

-- DropTable
DROP TABLE "UserToURCFundedResearchBridge";

-- DropTable
DROP TABLE "_ResearchDisseminationToURCFundedResearch";

-- DropTable
DROP TABLE "_URCFundedResearchToUnit";

-- CreateTable
CREATE TABLE "ProjectStatus" (
    "id" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "ProjectStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deadline" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "academic_term_id" TEXT NOT NULL,

    CONSTRAINT "Deadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicTerm" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "main_proponents" TEXT[],
    "co_proponents" TEXT[],
    "keywords" TEXT[],
    "abstract" TEXT,
    "duration" TEXT,
    "cycle" TEXT,
    "budget" DOUBLE PRECISION,
    "source_of_fund" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "completed_at" TEXT,
    "project_status_id" TEXT NOT NULL DEFAULT E'not_implemented',
    "slug" TEXT,
    "academic_term_id" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserToProjectBridge" (
    "project_id" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "admin_positions" TEXT,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "UserToProjectBridge_pkey" PRIMARY KEY ("project_id","user_id")
);

-- CreateTable
CREATE TABLE "_ProjectToResearchDissemination" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToUnit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_title_key" ON "Project"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToResearchDissemination_AB_unique" ON "_ProjectToResearchDissemination"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToResearchDissemination_B_index" ON "_ProjectToResearchDissemination"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToUnit_AB_unique" ON "_ProjectToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToUnit_B_index" ON "_ProjectToUnit"("B");

-- AddForeignKey
ALTER TABLE "CapsuleProposalSubmission" ADD CONSTRAINT "CapsuleProposalSubmission_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_research_id_fkey" FOREIGN KEY ("research_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalResearch" ADD CONSTRAINT "ExternalResearch_project_status_id_fkey" FOREIGN KEY ("project_status_id") REFERENCES "ProjectStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FullBlownProposalSubmission" ADD CONSTRAINT "FullBlownProposalSubmission_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchPresentation" ADD CONSTRAINT "ResearchPresentation_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RevisionRequirement" ADD CONSTRAINT "revision_requirement_research_id_fkey" FOREIGN KEY ("research_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_academic_term_id_fkey" FOREIGN KEY ("academic_term_id") REFERENCES "AcademicTerm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_project_status_id_fkey" FOREIGN KEY ("project_status_id") REFERENCES "ProjectStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_academic_term_id_fkey" FOREIGN KEY ("academic_term_id") REFERENCES "AcademicTerm"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToProjectBridge" ADD CONSTRAINT "user_to_research_research_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToProjectBridge" ADD CONSTRAINT "UserToProjectBridge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToResearchDissemination" ADD CONSTRAINT "_ProjectToResearchDissemination_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToResearchDissemination" ADD CONSTRAINT "_ProjectToResearchDissemination_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchDissemination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUnit" ADD CONSTRAINT "_ProjectToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUnit" ADD CONSTRAINT "_ProjectToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
