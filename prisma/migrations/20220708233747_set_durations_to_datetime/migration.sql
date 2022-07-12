/*
  Warnings:

  - You are about to drop the column `co_proponents` on the `ExternalResearch` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `ExternalResearch` table. All the data in the column will be lost.
  - You are about to drop the column `main_proponents` on the `ExternalResearch` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `ProfileToInstituteBridge` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExternalResearch" DROP COLUMN "co_proponents",
DROP COLUMN "duration",
DROP COLUMN "main_proponents",
ADD COLUMN     "duration_end" TIMESTAMP(3),
ADD COLUMN     "duration_start" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProfileToInstituteBridge" DROP COLUMN "duration";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "duration",
ADD COLUMN     "duration_end" TIMESTAMP(3),
ADD COLUMN     "duration_start" TIMESTAMP(3);
