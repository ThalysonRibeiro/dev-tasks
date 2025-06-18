/*
  Warnings:

  - Added the required column `textColor` to the `TasksGroupe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tasks" ADD COLUMN     "tasksGroupeId" TEXT;

-- AlterTable
ALTER TABLE "TasksGroupe" ADD COLUMN     "textColor" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_tasksGroupeId_fkey" FOREIGN KEY ("tasksGroupeId") REFERENCES "TasksGroupe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
