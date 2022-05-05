/*
  Warnings:

  - You are about to drop the column `unit_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BookPublicationToUnitBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JournalPublicationToUnitBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearchDisseminationToUnitBridge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResearchPresentationToUnitBridge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BookPublicationToUnitBridge" DROP CONSTRAINT "BookPublicationToUnitBridge_book_publication_id_fkey";

-- DropForeignKey
ALTER TABLE "BookPublicationToUnitBridge" DROP CONSTRAINT "BookPublicationToUnitBridge_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalPublicationToUnitBridge" DROP CONSTRAINT "JournalPublicationToUnitBridge_journal_publication_id_fkey";

-- DropForeignKey
ALTER TABLE "JournalPublicationToUnitBridge" DROP CONSTRAINT "JournalPublicationToUnitBridge_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchDisseminationToUnitBridge" DROP CONSTRAINT "ResearchDisseminationToUnitBridge_research_dissemination_i_fkey";

-- DropForeignKey
ALTER TABLE "ResearchDisseminationToUnitBridge" DROP CONSTRAINT "ResearchDisseminationToUnitBridge_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPresentationToUnitBridge" DROP CONSTRAINT "ResearchPresentationToUnitBridge_research_presentation_id_fkey";

-- DropForeignKey
ALTER TABLE "ResearchPresentationToUnitBridge" DROP CONSTRAINT "ResearchPresentationToUnitBridge_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_unit_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "unit_id";

-- DropTable
DROP TABLE "BookPublicationToUnitBridge";

-- DropTable
DROP TABLE "JournalPublicationToUnitBridge";

-- DropTable
DROP TABLE "ResearchDisseminationToUnitBridge";

-- DropTable
DROP TABLE "ResearchPresentationToUnitBridge";

-- CreateTable
CREATE TABLE "_ResearchPresentationToUnit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ResearchDisseminationToUnit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_JournalPublicationToUnit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BookPublicationToUnit" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UnitToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ResearchPresentationToUnit_AB_unique" ON "_ResearchPresentationToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_ResearchPresentationToUnit_B_index" ON "_ResearchPresentationToUnit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ResearchDisseminationToUnit_AB_unique" ON "_ResearchDisseminationToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_ResearchDisseminationToUnit_B_index" ON "_ResearchDisseminationToUnit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_JournalPublicationToUnit_AB_unique" ON "_JournalPublicationToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_JournalPublicationToUnit_B_index" ON "_JournalPublicationToUnit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BookPublicationToUnit_AB_unique" ON "_BookPublicationToUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_BookPublicationToUnit_B_index" ON "_BookPublicationToUnit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UnitToUser_AB_unique" ON "_UnitToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_UnitToUser_B_index" ON "_UnitToUser"("B");

-- AddForeignKey
ALTER TABLE "_ResearchPresentationToUnit" ADD CONSTRAINT "_ResearchPresentationToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "ResearchPresentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResearchPresentationToUnit" ADD CONSTRAINT "_ResearchPresentationToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResearchDisseminationToUnit" ADD CONSTRAINT "_ResearchDisseminationToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "ResearchDissemination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResearchDisseminationToUnit" ADD CONSTRAINT "_ResearchDisseminationToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalPublicationToUnit" ADD CONSTRAINT "_JournalPublicationToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "JournalPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_JournalPublicationToUnit" ADD CONSTRAINT "_JournalPublicationToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookPublicationToUnit" ADD CONSTRAINT "_BookPublicationToUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "BookPublication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookPublicationToUnit" ADD CONSTRAINT "_BookPublicationToUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitToUser" ADD CONSTRAINT "_UnitToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UnitToUser" ADD CONSTRAINT "_UnitToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
