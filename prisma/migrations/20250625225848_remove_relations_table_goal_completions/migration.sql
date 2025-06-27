-- DropForeignKey
ALTER TABLE "GoalCompletions" DROP CONSTRAINT "GoalCompletions_userId_fkey";

-- AlterTable
ALTER TABLE "GoalCompletions" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "GoalCompletions" ADD CONSTRAINT "GoalCompletions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
