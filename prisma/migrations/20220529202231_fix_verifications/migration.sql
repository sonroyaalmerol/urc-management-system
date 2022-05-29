/*
  Warnings:

  - The values [PROJECT_INSTITUTE,INSTITUTE_NEWS] on the enum `SubmissionTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `InstituteNewsSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectInstituteSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_InstituteToProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubmissionTypes_new" AS ENUM ('CAPSULE', 'FULL', 'BUDGET', 'DELIVERABLE');
ALTER TABLE "Submission" ALTER COLUMN "type" TYPE "SubmissionTypes_new" USING ("type"::text::"SubmissionTypes_new");
ALTER TYPE "SubmissionTypes" RENAME TO "SubmissionTypes_old";
ALTER TYPE "SubmissionTypes_new" RENAME TO "SubmissionTypes";
DROP TYPE "SubmissionTypes_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "VerificationTypes" ADD VALUE 'INSTITUTE_NEWS';
ALTER TYPE "VerificationTypes" ADD VALUE 'PROJECT_INSTITUTE';

-- DropForeignKey
ALTER TABLE "InstituteNewsSubmission" DROP CONSTRAINT "InstituteNewsSubmission_institute_news_id_fkey";

-- DropForeignKey
ALTER TABLE "InstituteNewsSubmission" DROP CONSTRAINT "InstituteNewsSubmission_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInstituteSubmission" DROP CONSTRAINT "ProjectInstituteSubmission_institute_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInstituteSubmission" DROP CONSTRAINT "ProjectInstituteSubmission_project_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectInstituteSubmission" DROP CONSTRAINT "ProjectInstituteSubmission_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "_InstituteToProject" DROP CONSTRAINT "_InstituteToProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_InstituteToProject" DROP CONSTRAINT "_InstituteToProject_B_fkey";

-- AlterTable
ALTER TABLE "InstituteNews" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VerificationRequest" ADD COLUMN     "institute_news_id" TEXT,
ADD COLUMN     "project_institute_institute_id" TEXT,
ADD COLUMN     "project_institute_project_id" TEXT;

-- DropTable
DROP TABLE "InstituteNewsSubmission";

-- DropTable
DROP TABLE "ProjectInstituteSubmission";

-- DropTable
DROP TABLE "_InstituteToProject";

-- CreateTable
CREATE TABLE "ProjectToInstituteBridge" (
    "project_id" TEXT NOT NULL,
    "institute_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectToInstituteBridge_pkey" PRIMARY KEY ("project_id","institute_id")
);

-- AddForeignKey
ALTER TABLE "ProjectToInstituteBridge" ADD CONSTRAINT "ProjectToInstituteBridge_institute_id_fkey" FOREIGN KEY ("institute_id") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectToInstituteBridge" ADD CONSTRAINT "ProjectToInstituteBridge_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_project_institute_project_id_project_i_fkey" FOREIGN KEY ("project_institute_project_id", "project_institute_institute_id") REFERENCES "ProjectToInstituteBridge"("project_id", "institute_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_institute_news_id_fkey" FOREIGN KEY ("institute_news_id") REFERENCES "InstituteNews"("id") ON DELETE SET NULL ON UPDATE CASCADE;
