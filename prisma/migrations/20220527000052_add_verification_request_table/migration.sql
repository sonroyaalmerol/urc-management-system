/*
  Warnings:

  - You are about to drop the column `verified` on the `BookPublication` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `ExternalResearch` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `ResearchDissemination` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `ResearchEventAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `ResearchPresentation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[verification_request_id]` on the table `BookPublication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verification_request_id]` on the table `ExternalResearch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verification_request_id]` on the table `JournalPublication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verification_request_id]` on the table `ResearchDissemination` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verification_request_id]` on the table `ResearchEventAttendance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[verification_request_id]` on the table `ResearchPresentation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "VerificationTypes" AS ENUM ('EXTERNAL_RESEARCH', 'JOURNAL_PUBLICATION', 'BOOK_PUBLICATION', 'RESEARCH_DISSEMINATION', 'RESEARCH_PRESENTATION', 'RESEARCH_EVENT_ATTENDANCE');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'NOT_VERIFIED', 'INVALID');

-- AlterTable
ALTER TABLE "BookPublication" DROP COLUMN "verified",
ADD COLUMN     "verification_request_id" TEXT;

-- AlterTable
ALTER TABLE "ExternalResearch" DROP COLUMN "verified",
ADD COLUMN     "verification_request_id" TEXT;

-- AlterTable
ALTER TABLE "JournalPublication" DROP COLUMN "verified",
ADD COLUMN     "verification_request_id" TEXT;

-- AlterTable
ALTER TABLE "ResearchDissemination" DROP COLUMN "verified",
ADD COLUMN     "verification_request_id" TEXT;

-- AlterTable
ALTER TABLE "ResearchEventAttendance" DROP COLUMN "verified",
ADD COLUMN     "verification_request_id" TEXT;

-- AlterTable
ALTER TABLE "ResearchPresentation" DROP COLUMN "verified",
ADD COLUMN     "verification_request_id" TEXT;

-- CreateTable
CREATE TABLE "VerificationRequest" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "description" TEXT,
    "type" "VerificationTypes" NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT E'NOT_VERIFIED',
    "profile_id" TEXT NOT NULL,

    CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookPublication_verification_request_id_key" ON "BookPublication"("verification_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalResearch_verification_request_id_key" ON "ExternalResearch"("verification_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "JournalPublication_verification_request_id_key" ON "JournalPublication"("verification_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchDissemination_verification_request_id_key" ON "ResearchDissemination"("verification_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchEventAttendance_verification_request_id_key" ON "ResearchEventAttendance"("verification_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchPresentation_verification_request_id_key" ON "ResearchPresentation"("verification_request_id");

-- AddForeignKey
ALTER TABLE "VerificationRequest" ADD CONSTRAINT "VerificationRequest_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalResearch" ADD CONSTRAINT "ExternalResearch_verification_request_id_fkey" FOREIGN KEY ("verification_request_id") REFERENCES "VerificationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchEventAttendance" ADD CONSTRAINT "ResearchEventAttendance_verification_request_id_fkey" FOREIGN KEY ("verification_request_id") REFERENCES "VerificationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchPresentation" ADD CONSTRAINT "ResearchPresentation_verification_request_id_fkey" FOREIGN KEY ("verification_request_id") REFERENCES "VerificationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchDissemination" ADD CONSTRAINT "ResearchDissemination_verification_request_id_fkey" FOREIGN KEY ("verification_request_id") REFERENCES "VerificationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalPublication" ADD CONSTRAINT "JournalPublication_verification_request_id_fkey" FOREIGN KEY ("verification_request_id") REFERENCES "VerificationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPublication" ADD CONSTRAINT "BookPublication_verification_request_id_fkey" FOREIGN KEY ("verification_request_id") REFERENCES "VerificationRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
