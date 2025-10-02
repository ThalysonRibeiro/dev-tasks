/*
  Warnings:

  - You are about to drop the column `emailVerificationToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationExpiresAt` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "createdBy" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "emailVerificationToken",
DROP COLUMN "verificationExpiresAt",
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "public"."User"("isActive");

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
