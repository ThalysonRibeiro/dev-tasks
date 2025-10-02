"use client"
import { Prisma } from "@/generated/prisma";
import { Groups } from "./groups";

export type GroupWithItems = Prisma.GroupGetPayload<{
  include: {
    item: {
      select: {
        id: true,
        title: true,
        term: true,
        priority: true,
        status: true,
        notes: true,
        description: true,
        createdBy: true,
        assignedTo: true,
        createdByUser: true,
        assignedToUser: true,
      }
    }
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
        {groupsData.length === 0 && <h2>Cadastre um grupo</h2>}
        <Groups groupsData={groupsData} desktopId={desktopId} />
      </div>
    </article>
  )
}