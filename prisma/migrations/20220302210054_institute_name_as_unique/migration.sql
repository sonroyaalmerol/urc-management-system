/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Institute` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Institute" ADD COLUMN     "address" TEXT,
ADD COLUMN     "contact_number" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "research_areas" TEXT;

-- AlterTable
ALTER TABLE "InstituteToUserBridge" ADD COLUMN     "duration" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "honorific" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "middle_initial" TEXT,
ADD COLUMN     "titles" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Institute_name_key" ON "Institute"("name");
