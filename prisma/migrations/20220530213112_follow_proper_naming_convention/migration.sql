/*
  Warnings:

  - You are about to drop the column `isHead` on the `ProfileToInstituteBridge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfileToInstituteBridge" DROP COLUMN "isHead",
ADD COLUMN     "is_head" BOOLEAN NOT NULL DEFAULT false;
