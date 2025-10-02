-- DropForeignKey
ALTER TABLE "public"."Item" DROP CONSTRAINT "Item_groupId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Item" ADD CONSTRAINT "Item_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
