/*
  Warnings:

  - The values [RESEARCH_EVENT_ATTENDANCE] on the enum `VerificationTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VerificationTypes_new" AS ENUM ('EXTERNAL_RESEARCH', 'JOURNAL_PUBLICATION', 'BOOK_PUBLICATION', 'RESEARCH_DISSEMINATION', 'RESEARCH_PRESENTATION', 'RESEARCH_EVENT');
ALTER TABLE "VerificationRequest" ALTER COLUMN "type" TYPE "VerificationTypes_new" USING ("type"::text::"VerificationTypes_new");
ALTER TYPE "VerificationTypes" RENAME TO "VerificationTypes_old";
ALTER TYPE "VerificationTypes_new" RENAME TO "VerificationTypes";
DROP TYPE "VerificationTypes_old";
COMMIT;
