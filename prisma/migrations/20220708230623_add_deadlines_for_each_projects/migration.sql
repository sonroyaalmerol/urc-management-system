/*
  Warnings:

  - You are about to drop the column `co_proponents` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `main_proponents` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "co_proponents",
DROP COLUMN "main_proponents";

-- CreateTable
CREATE TABLE "_DeadlineToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DeadlineToProject_AB_unique" ON "_DeadlineToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_DeadlineToProject_B_index" ON "_DeadlineToProject"("B");

-- AddForeignKey
ALTER TABLE "_DeadlineToProject" ADD CONSTRAINT "_DeadlineToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Deadline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeadlineToProject" ADD CONSTRAINT "_DeadlineToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
