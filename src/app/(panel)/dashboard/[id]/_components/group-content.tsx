"use client"
import { Prisma } from "@/generated/prisma";
import { Groups } from "./groups";

export type GroupWithItems = Prisma.GroupGetPayload<{
  include: {
    item: true
  }
}>

interface GroupContentProps {
  groupsData: GroupWithItems[];
  desktopId: string;
}

export function GroupContent({ groupsData, desktopId }: GroupContentProps) {

  return (
    <article>
      <div>
        <Groups groupsData={groupsData} desktopId={desktopId} />
      </div>
    </article>
  )
}