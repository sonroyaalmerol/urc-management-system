/*
  Warnings:

  - You are about to drop the column `honorific` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `middle_initial` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `titles` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "honorific" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "middle_initial" TEXT,
ADD COLUMN     "titles" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "honorific",
DROP COLUMN "middle_initial",
DROP COLUMN "titles";
