/*
  Warnings:

  - You are about to drop the `TasksGroupe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_tasksGroupeId_fkey";

-- DropForeignKey
ALTER TABLE "TasksGroupe" DROP CONSTRAINT "TasksGroupe_userId_fkey";

-- DropTable
DROP TABLE "TasksGroupe";

-- CreateTable
CREATE TABLE "TasksGroup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TasksGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TasksGroup" ADD CONSTRAINT "TasksGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_tasksGroupeId_fkey" FOREIGN KEY ("tasksGroupeId") REFERENCES "TasksGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
