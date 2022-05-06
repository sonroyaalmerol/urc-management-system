/*
  Warnings:

  - You are about to drop the column `column_name` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `new_value` on the `Audit` table. All the data in the column will be lost.
  - You are about to drop the column `old_value` on the `Audit` table. All the data in the column will be lost.
  - Added the required column `action` to the `Audit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `args` to the `Audit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Audit" DROP COLUMN "column_name",
DROP COLUMN "new_value",
DROP COLUMN "old_value",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "args" TEXT NOT NULL;
