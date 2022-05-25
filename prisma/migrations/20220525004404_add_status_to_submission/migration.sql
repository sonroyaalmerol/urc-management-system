-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('APPROVED', 'NOT_APPROVED', 'NOT_PROCESSED');

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "status" "SubmissionStatus" NOT NULL DEFAULT E'NOT_PROCESSED';
