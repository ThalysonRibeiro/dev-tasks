-- CreateTable
CREATE TABLE "public"."Assessments" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assessments_userId_key" ON "public"."Assessments"("userId");

-- AddForeignKey
ALTER TABLE "public"."Assessments" ADD CONSTRAINT "Assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
