/*
  Warnings:

  - You are about to drop the column `userId` on the `GoalCompletions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GoalCompletions" DROP CONSTRAINT "GoalCompletions_userId_fkey";

-- AlterTable
ALTER TABLE "GoalCompletions" DROP COLUMN "userId";
