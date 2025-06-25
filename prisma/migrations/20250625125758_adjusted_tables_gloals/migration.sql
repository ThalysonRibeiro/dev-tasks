/*
  Warnings:

  - Added the required column `userId` to the `Goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Goals" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
