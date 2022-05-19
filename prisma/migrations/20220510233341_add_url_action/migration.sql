/*
  Warnings:

  - You are about to drop the column `table_name` on the `Action` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "table_name",
ADD COLUMN     "url" TEXT;
