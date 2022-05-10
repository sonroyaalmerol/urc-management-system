/*
  Warnings:

  - You are about to drop the column `research_id` on the `Deliverable` table. All the data in the column will be lost.
  - Added the required column `project_id` to the `Deliverable` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deliverable" DROP CONSTRAINT "Deliverable_research_id_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "budget_proposal_submission_id" TEXT,
ADD COLUMN     "capsule_proposal_submission_id" TEXT,
ADD COLUMN     "full_blown_proposal_id" TEXT,
ALTER COLUMN "deliverable_submission_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Deliverable" DROP COLUMN "research_id",
ADD COLUMN     "project_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BudgetProposalSubmission" (
    "id" TEXT NOT NULL,
    "deliverable_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "project_id" TEXT NOT NULL,
    "upload_id" TEXT NOT NULL,

    CONSTRAINT "BudgetProposalSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_capsule_proposal_submission_id_fkey" FOREIGN KEY ("capsule_proposal_submission_id") REFERENCES "CapsuleProposalSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_budget_proposal_submission_id_fkey" FOREIGN KEY ("budget_proposal_submission_id") REFERENCES "BudgetProposalSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_full_blown_proposal_id_fkey" FOREIGN KEY ("full_blown_proposal_id") REFERENCES "FullBlownProposalSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetProposalSubmission" ADD CONSTRAINT "BudgetProposalSubmission_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "FileUpload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetProposalSubmission" ADD CONSTRAINT "BudgetProposalSubmission_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
