/*
  Warnings:

  - You are about to drop the column `verification_request_id` on the `BookPublication` table. All the data in the column will be lost.
  - You are about to drop the column `verification_request_id` on the `ExternalResearch` table. All the data in the column will be lost.
  - You are about to drop the column `verification_request_id` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `verification_request_id` on the `ResearchDissemination` table. All the data in the column will be lost.
  - You are about to drop the column `verification_request_id` on the `ResearchEventAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `verification_request_id` on the `ResearchPresentation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookPublication" DROP CONSTRAINT "BookPublication_verification_request_id_fkey";

-- DropForeignKey
ALTER TABLE "ExternalResearch" DROP CONSTRAINT "ExternalResearch_verification_request_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalPublication" DROP CONSTRAINT "JournalPublication_verification_request_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchDissemination" DROP CONSTRAINT "ResearchDissemination_verification_request_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchEventAttendance" DROP CONSTRAINT "ResearchEventAttendance_verification_request_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPresentation" DROP CONSTRAINT "ResearchPresentation_verification_request_id_fkey";

-- DropIndex
DROP INDEX "BookPublication_verification_request_id_key";

-- DropIndex
DROP INDEX "ExternalResearch_verification_request_id_key";

-- DropIndex
DROP INDEX "JournalPublication_verification_request_id_key";

-- DropIndex
DROP INDEX "ResearchDissemination_verification_request_id_key";

-- DropIndex
DROP INDEX "ResearchEventAttendance_verification_request_id_key";

-- DropIndex
DROP INDEX "ResearchPresentation_verification_request_id_key";

-- AlterTable
ALTER TABLE "BookPublication" DROP COLUMN "verification_request_id";

-- AlterTable
ALTER TABLE "ExternalResearch" DROP COLUMN "verification_request_id";

-- AlterTable
ALTER TABLE "JournalPublication" DROP COLUMN "verification_request_id";

-- AlterTable
ALTER TABLE "ResearchDissemination" DROP COLUMN "verification_request_id";

-- AlterTable
ALTER TABLE "ResearchEventAttendance" DROP COLUMN "verification_request_id";

-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "verification_request_id";

-- AlterTable
ALTER TABLE "VerificationRequest" ADD COLUMN     "book_publication_id" TEXT,
ADD COLUMN     "external_research_id" TEXT,
ADD COLUMN     "journal_publication_id" TEXT,
ADD COLUMN     "research_dissemination_id" TEXT,
ADD COLUMN     "research_event_attendance_id" TEXT,
ADD COLUMN     "research_presentation_id" TEXT;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_external_research_id_fkey" FOREIGN KEY ("external_research_id") REFERENCES "ExternalResearch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_research_event_attendance_id_fkey" FOREIGN KEY ("research_event_attendance_id") REFERENCES "ResearchEventAttendance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_research_presentation_id_fkey" FOREIGN KEY ("research_presentation_id") REFERENCES "ResearchPresentation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_research_dissemination_id_fkey" FOREIGN KEY ("research_dissemination_id") REFERENCES "ResearchDissemination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_journal_publication_id_fkey" FOREIGN KEY ("journal_publication_id") REFERENCES "JournalPublication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_book_publication_id_fkey" FOREIGN KEY ("book_publication_id") REFERENCES "BookPublication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
