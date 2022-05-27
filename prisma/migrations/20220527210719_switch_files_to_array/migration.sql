/*
  Warnings:

  - You are about to drop the column `proof_upload_id` on the `BookPublication` table. All the data in the column will be lost.
  - You are about to drop the column `proof_upload_id` on the `JournalPublication` table. All the data in the column will be lost.
  - You are about to drop the column `proof_upload_id` on the `ResearchEventAttendance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookPublication" DROP CONSTRAINT "BookPublication_proof_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "ExternalResearch" DROP CONSTRAINT "ExternalResearch_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalPublication" DROP CONSTRAINT "JournalPublication_proof_upload_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchEventAttendance" DROP CONSTRAINT "ResearchEventAttendance_proof_upload_id_fkey";

-- AlterTable
ALTER TABLE "BookPublication" DROP COLUMN "proof_upload_id";

-- AlterTable
ALTER TABLE "JournalPublication" DROP COLUMN "proof_upload_id";

-- AlterTable
ALTER TABLE "ResearchEventAttendance" DROP COLUMN "proof_upload_id";

-- CreateTable
CREATE TABLE "_ExternalResearchToFileUpload" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FileUploadToResearchEventAttendance" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FileUploadToJournalPublication" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FileUploadToResearchPresentation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FileUploadToResearchDissemination" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FileUploadToVerificationRequest" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BookPublicationToFileUpload" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExternalResearchToFileUpload_AB_unique" ON "_ExternalResearchToFileUpload"("A", "B");

-- CreateIndex
CREATE INDEX "_ExternalResearchToFileUpload_B_index" ON "_ExternalResearchToFileUpload"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileUploadToResearchEventAttendance_AB_unique" ON "_FileUploadToResearchEventAttendance"("A", "B");

-- CreateIndex
CREATE INDEX "_FileUploadToResearchEventAttendance_B_index" ON "_FileUploadToResearchEventAttendance"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileUploadToJournalPublication_AB_unique" ON "_FileUploadToJournalPublication"("A", "B");

-- CreateIndex
CREATE INDEX "_FileUploadToJournalPublication_B_index" ON "_FileUploadToJournalPublication"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileUploadToResearchPresentation_AB_unique" ON "_FileUploadToResearchPresentation"("A", "B");

-- CreateIndex
CREATE INDEX "_FileUploadToResearchPresentation_B_index" ON "_FileUploadToResearchPresentation"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileUploadToResearchDissemination_AB_unique" ON "_FileUploadToResearchDissemination"("A", "B");

-- CreateIndex
CREATE INDEX "_FileUploadToResearchDissemination_B_index" ON "_FileUploadToResearchDissemination"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FileUploadToVerificationRequest_AB_unique" ON "_FileUploadToVerificationRequest"("A", "B");

-- CreateIndex
CREATE INDEX "_FileUploadToVerificationRequest_B_index" ON "_FileUploadToVerificationRequest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BookPublicationToFileUpload_AB_unique" ON "_BookPublicationToFileUpload"("A", "B");

-- CreateIndex
CREATE INDEX "_BookPublicationToFileUpload_B_index" ON "_BookPublicationToFileUpload"("B");

-- AddForeignKey
ALTER TABLE "_ExternalResearchToFileUpload" ADD CONSTRAINT "_ExternalResearchToFileUpload_A_fkey" FOREIGN KEY ("A") REFERENCES "ExternalResearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExternalResearchToFileUpload" ADD CONSTRAINT "_ExternalResearchToFileUpload_B_fkey" FOREIGN KEY ("B") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToResearchEventAttendance" ADD CONSTRAINT "_FileUploadToResearchEventAttendance_A_fkey" FOREIGN KEY ("A") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToResearchEventAttendance" ADD CONSTRAINT "_FileUploadToResearchEventAttendance_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchEventAttendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToJournalPublication" ADD CONSTRAINT "_FileUploadToJournalPublication_A_fkey" FOREIGN KEY ("A") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToJournalPublication" ADD CONSTRAINT "_FileUploadToJournalPublication_B_fkey" FOREIGN KEY ("B") REFERENCES "JournalPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToResearchPresentation" ADD CONSTRAINT "_FileUploadToResearchPresentation_A_fkey" FOREIGN KEY ("A") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToResearchPresentation" ADD CONSTRAINT "_FileUploadToResearchPresentation_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchPresentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToResearchDissemination" ADD CONSTRAINT "_FileUploadToResearchDissemination_A_fkey" FOREIGN KEY ("A") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToResearchDissemination" ADD CONSTRAINT "_FileUploadToResearchDissemination_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchDissemination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToVerificationRequest" ADD CONSTRAINT "_FileUploadToVerificationRequest_A_fkey" FOREIGN KEY ("A") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileUploadToVerificationRequest" ADD CONSTRAINT "_FileUploadToVerificationRequest_B_fkey" FOREIGN KEY ("B") REFERENCES "VerificationRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookPublicationToFileUpload" ADD CONSTRAINT "_BookPublicationToFileUpload_A_fkey" FOREIGN KEY ("A") REFERENCES "BookPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookPublicationToFileUpload" ADD CONSTRAINT "_BookPublicationToFileUpload_B_fkey" FOREIGN KEY ("B") REFERENCES "FileUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
