/*
  Warnings:

  - You are about to drop the column `deadline` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `schedule` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Tasks` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_userId_fkey";

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "deadline",
DROP COLUMN "schedule",
DROP COLUMN "userId",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "TasksGroupe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TasksGroupe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TasksGroupe" ADD CONSTRAINT "TasksGroupe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
