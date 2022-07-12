/*
  Warnings:

  - You are about to drop the column `research_areas` on the `Institute` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Institute" DROP COLUMN "research_areas";

-- CreateTable
CREATE TABLE "_InstituteToResearchArea" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InstituteToResearchArea_AB_unique" ON "_InstituteToResearchArea"("A", "B");

-- CreateIndex
CREATE INDEX "_InstituteToResearchArea_B_index" ON "_InstituteToResearchArea"("B");

-- AddForeignKey
ALTER TABLE "_InstituteToResearchArea" ADD CONSTRAINT "_InstituteToResearchArea_A_fkey" FOREIGN KEY ("A") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstituteToResearchArea" ADD CONSTRAINT "_InstituteToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("field") ON DELETE CASCADE ON UPDATE CASCADE;
