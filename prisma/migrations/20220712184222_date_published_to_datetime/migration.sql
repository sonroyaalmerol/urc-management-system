/*
  Warnings:

  - The `date_published` column on the `BookPublication` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "BookPublication" DROP COLUMN "date_published",
ADD COLUMN     "date_published" TIMESTAMP(3);
