/*
  Warnings:

  - You are about to drop the column `tasksGroupeId` on the `Tasks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_tasksGroupeId_fkey";

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "tasksGroupeId",
ADD COLUMN     "tasksGroupId" TEXT;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_tasksGroupId_fkey" FOREIGN KEY ("tasksGroupId") REFERENCES "TasksGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
