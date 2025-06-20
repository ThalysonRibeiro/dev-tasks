/*
  Warnings:

  - You are about to drop the `Tasks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TasksGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_tasksGroupId_fkey";

-- DropForeignKey
ALTER TABLE "TasksGroup" DROP CONSTRAINT "TasksGroup_userId_fkey";

-- DropTable
DROP TABLE "Tasks";

-- DropTable
DROP TABLE "TasksGroup";

-- CreateTable
CREATE TABLE "Goals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desiredWeeklyFrequency" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalCompletions" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoalCompletions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Desktop" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Desktop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "textColor" TEXT NOT NULL,
    "desktopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'NOT_STARTED',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'STANDARD',
    "notes" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "groupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GoalCompletions" ADD CONSTRAINT "GoalCompletions_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalCompletions" ADD CONSTRAINT "GoalCompletions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Desktop" ADD CONSTRAINT "Desktop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_desktopId_fkey" FOREIGN KEY ("desktopId") REFERENCES "Desktop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
