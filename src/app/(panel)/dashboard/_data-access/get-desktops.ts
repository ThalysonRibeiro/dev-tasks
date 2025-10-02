"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getDesktops(cursor?: string, take = 50) {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }
  try {
    const desktops = await prisma.desktop.findMany({
      where: { userId: session.user.id },
      include: { _count: { select: { groups: true } } },
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
    });

    const groupsWithCount = await prisma.group.findMany({
      where: { desktopId: { in: desktops.map(d => d.id) } },
      select: {
        desktopId: true,
        _count: { select: { item: true } }
      }
    });

    const desktopSummaries = desktops.map(desktop => {
      const totalItems = groupsWithCount
        .filter(g => g.desktopId === desktop.id)
        .reduce((acc, g) => acc + g._count.item, 0);

      return {
        id: desktop.id,
        title: desktop.title,
        groupsCount: desktop._count.groups,
        itemsCount: totalItems
      };
    });

    return desktopSummaries;

  } catch (error) {
    return [];
  }
}