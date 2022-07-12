/*
  Warnings:

  - The primary key for the `ResearchArea` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[field]` on the table `ResearchArea` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `ResearchArea` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_InstituteToResearchArea" DROP CONSTRAINT "_InstituteToResearchArea_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileToResearchArea" DROP CONSTRAINT "_ProfileToResearchArea_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToResearchArea" DROP CONSTRAINT "_ProjectToResearchArea_B_fkey";

-- AlterTable
ALTER TABLE "ResearchArea" DROP CONSTRAINT "ResearchArea_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ResearchArea_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchArea_field_key" ON "ResearchArea"("field");

-- AddForeignKey
ALTER TABLE "_InstituteToResearchArea" ADD CONSTRAINT "_InstituteToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToResearchArea" ADD CONSTRAINT "_ProjectToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToResearchArea" ADD CONSTRAINT "_ProfileToResearchArea_B_fkey" FOREIGN KEY ("B") REFERENCES "ResearchArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
