/*
  Warnings:

  - You are about to drop the column `user_id` on the `Audit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Audit" DROP CONSTRAINT "Audit_user_id_fkey";

-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "user_id";
