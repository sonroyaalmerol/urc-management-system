/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `InstituteNews` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "InstituteNews_title_key" ON "InstituteNews"("title");
