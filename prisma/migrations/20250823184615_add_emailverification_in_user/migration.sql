-- AlterTable
ALTER TABLE "User" ADD COLUMN     "acceptTerms" BOOLEAN DEFAULT true,
ADD COLUMN     "emailVerificationToken" TEXT;
