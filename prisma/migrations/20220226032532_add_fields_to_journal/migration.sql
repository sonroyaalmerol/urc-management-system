/*
  Warnings:

  - Added the required column `title` to the `JournalPublication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JournalPublication" ADD COLUMN     "authors" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
