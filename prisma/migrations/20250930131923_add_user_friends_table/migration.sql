/*
  Warnings:

  - The values [INVITE,ITEM_UPDATED,ITEM_COMPLETED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."FriendStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."NotificationType_new" AS ENUM ('FRIEND_REQUEST', 'FRIEND_ACCEPTED', 'DESKTOP_INVITE', 'ITEM_ASSIGNED', 'CHAT_MESSAGE');
ALTER TABLE "public"."Notification" ALTER COLUMN "type" TYPE "public"."NotificationType_new" USING ("type"::text::"public"."NotificationType_new");
ALTER TYPE "public"."NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "public"."NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;

-- CreateTable
CREATE TABLE "public"."UserFriend" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "addresseeId" TEXT NOT NULL,
    "status" "public"."FriendStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFriend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "desktopId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatMember" (
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatMember_pkey" PRIMARY KEY ("chatId","userId")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserFriend_requesterId_addresseeId_key" ON "public"."UserFriend"("requesterId", "addresseeId");

-- AddForeignKey
ALTER TABLE "public"."UserFriend" ADD CONSTRAINT "UserFriend_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFriend" ADD CONSTRAINT "UserFriend_addresseeId_fkey" FOREIGN KEY ("addresseeId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_desktopId_fkey" FOREIGN KEY ("desktopId") REFERENCES "public"."Desktop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMember" ADD CONSTRAINT "ChatMember_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMember" ADD CONSTRAINT "ChatMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
