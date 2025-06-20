/*
  Warnings:

  - You are about to drop the column `budget` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Item` table. All the data in the column will be lost.
  - Added the required column `description` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "budget",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "term" TIMESTAMP(3) NOT NULL;
