/*
  Warnings:

  - You are about to drop the column `title` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "title";

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
