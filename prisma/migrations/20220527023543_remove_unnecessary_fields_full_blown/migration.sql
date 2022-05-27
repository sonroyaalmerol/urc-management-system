/*
  Warnings:

  - You are about to drop the column `title` on the `FullBlownProposalSubmission` table. All the data in the column will be lost.
  - You are about to drop the column `upload_id` on the `FullBlownProposalSubmission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FullBlownProposalSubmission" DROP COLUMN "title",
DROP COLUMN "upload_id";
