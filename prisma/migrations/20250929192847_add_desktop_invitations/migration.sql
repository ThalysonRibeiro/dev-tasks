-- CreateEnum
CREATE TYPE "public"."SpatusInvitation" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INVITE', 'ITEM_ASSIGNED', 'ITEM_UPDATED', 'ITEM_COMPLETED');

-- CreateTable
CREATE TABLE "public"."DesktopMember" (
    "desktopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DesktopMember_pkey" PRIMARY KEY ("desktopId","userId")
);

-- CreateTable
CREATE TABLE "public"."DesktopInvitation" (
    "id" TEXT NOT NULL,
    "desktopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "public"."SpatusInvitation" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DesktopInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "referenceId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DesktopMember" ADD CONSTRAINT "DesktopMember_desktopId_fkey" FOREIGN KEY ("desktopId") REFERENCES "public"."Desktop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesktopMember" ADD CONSTRAINT "DesktopMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesktopInvitation" ADD CONSTRAINT "DesktopInvitation_desktopId_fkey" FOREIGN KEY ("desktopId") REFERENCES "public"."Desktop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesktopInvitation" ADD CONSTRAINT "DesktopInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
