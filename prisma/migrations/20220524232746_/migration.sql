/*
  Warnings:

  - You are about to drop the column `deliverable_id` on the `BudgetProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `BudgetProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `BudgetProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `BudgetProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `upload_id` on the `BudgetProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `CapsuleProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `CapsuleProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `budget_proposal_submission_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `capsule_proposal_submission_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `deliverable_submission_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `full_blown_proposal_id` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `DeliverableSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `DeliverableSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `FullBlownProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the `RevisionRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RevisionSubmission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[submission_id]` on the table `BudgetProposalSubmission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submission_id]` on the table `CapsuleProposalSubmission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submission_id]` on the table `DeliverableSubmission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submission_id]` on the table `FullBlownProposalSubmission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `submission_id` to the `BudgetProposalSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submission_id` to the `CapsuleProposalSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submission_id` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submission_id` to the `DeliverableSubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submission_id` to the `FullBlownProposalSubmission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubmissionTypes" AS ENUM ('CAPSULE', 'FULL', 'BUDGET', 'DELIVERABLE');

-- DropForeignKey
ALTER TABLE "BudgetProposalSubmission" DROP CONSTRAINT "BudgetProposalSubmission_project_id_fkey";

-- DropForeignKey
ALTER TABLE "BudgetProposalSubmission" DROP CONSTRAINT "BudgetProposalSubmission_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "CapsuleProposalSubmission" DROP CONSTRAINT "CapsuleProposalSubmission_project_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_budget_proposal_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_capsule_proposal_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_deliverable_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_full_blown_proposal_id_fkey";

-- DropForeignKey
ALTER TABLE "FullBlownProposalSubmission" DROP CONSTRAINT "FullBlownProposalSubmission_project_id_fkey";

-- DropForeignKey
ALTER TABLE "FullBlownProposalSubmission" DROP CONSTRAINT "FullBlownProposalSubmission_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "RevisionRequirement" DROP CONSTRAINT "revision_requirement_research_id_fkey";

-- DropForeignKey
ALTER TABLE "RevisionSubmission" DROP CONSTRAINT "revision_submission_requirement_id_fkey";

-- AlterTable
ALTER TABLE "BudgetProposalSubmission" DROP COLUMN "deliverable_id",
DROP COLUMN "description",
DROP COLUMN "project_id",
DROP COLUMN "title",
DROP COLUMN "upload_id",
ADD COLUMN     "submission_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CapsuleProposalSubmission" DROP COLUMN "project_id",
DROP COLUMN "title",
ADD COLUMN     "submission_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "budget_proposal_submission_id",
DROP COLUMN "capsule_proposal_submission_id",
DROP COLUMN "deliverable_submission_id",
DROP COLUMN "full_blown_proposal_id",
ADD COLUMN     "submission_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DeliverableSubmission" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "submission_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FullBlownProposalSubmission" DROP COLUMN "project_id",
ADD COLUMN     "submission_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "RevisionRequirement";

-- DropTable
DROP TABLE "RevisionSubmission";

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "SubmissionTypes" NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FileUploadToSubmission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FileUploadToSubmission_AB_unique" ON "_FileUploadToSubmission"("A", "B");

-- CreateIndex
CREATE INDEX "_FileUploadToSubmission_B_index" ON "_FileUploadToSubmission"("B");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetProposalSubmission_submission_id_key" ON "BudgetProposalSubmission"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "CapsuleProposalSubmission_submission_id_key" ON "CapsuleProposalSubmission"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "DeliverableSubmission_submission_id_key" ON "DeliverableSubmission"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "FullBlownProposalSubmission_submission_id_key" ON "FullBlownProposalSubmission"("submission_id");

-- AddForeignKey
ALTER TABLE "CapsuleProposalSubmission" ADD CONSTRAINT "CapsuleProposalSubmission_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliverableSubmission" ADD CONSTRAINT "DeliverableSubmission_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetProposalSubmission" ADD CONSTRAINT "BudgetProposalSubmission_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FullBlownProposalSubmission" ADD CONSTRAINT "FullBlownProposalSubmission_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToSubmission" ADD CONSTRAINT "_FileUploadToSubmission_A_fkey" FOREIGN KEY ("A") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToSubmission" ADD CONSTRAINT "_FileUploadToSubmission_B_fkey" FOREIGN KEY ("B") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
