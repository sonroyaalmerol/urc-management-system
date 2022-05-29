/*
  Warnings:

  - You are about to drop the column `institute_id` on the `Project` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SubmissionTypes" ADD VALUE 'PROJECT_INSTITUTE';
ALTER TYPE "SubmissionTypes" ADD VALUE 'INSTITUTE_NEWS';

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_institute_id_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "institute_id";

-- CreateTable
CREATE TABLE "ProjectInstituteSubmission" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "institute_id" TEXT NOT NULL,
    "description" TEXT,
    "submission_id" TEXT NOT NULL,

    CONSTRAINT "ProjectInstituteSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstituteNewsSubmission" (
    "id" TEXT NOT NULL,
    "institute_news_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "submission_id" TEXT NOT NULL,

    CONSTRAINT "InstituteNewsSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InstituteToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInstituteSubmission_submission_id_key" ON "ProjectInstituteSubmission"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteNewsSubmission_submission_id_key" ON "InstituteNewsSubmission"("submission_id");

-- CreateIndex
CREATE UNIQUE INDEX "_InstituteToProject_AB_unique" ON "_InstituteToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_InstituteToProject_B_index" ON "_InstituteToProject"("B");

-- AddForeignKey
ALTER TABLE "ProjectInstituteSubmission" ADD CONSTRAINT "ProjectInstituteSubmission_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInstituteSubmission" ADD CONSTRAINT "ProjectInstituteSubmission_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectInstituteSubmission" ADD CONSTRAINT "ProjectInstituteSubmission_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteNewsSubmission" ADD CONSTRAINT "InstituteNewsSubmission_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstituteNewsSubmission" ADD CONSTRAINT "InstituteNewsSubmission_institute_news_id_fkey" FOREIGN KEY ("institute_news_id") REFERENCES "InstituteNews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstituteToProject" ADD CONSTRAINT "_InstituteToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstituteToProject" ADD CONSTRAINT "_InstituteToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
