/*
  Warnings:

  - You are about to drop the column `eemailVerified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "eemailVerified",
ADD COLUMN     "emailVerified" TIMESTAMP(3);
