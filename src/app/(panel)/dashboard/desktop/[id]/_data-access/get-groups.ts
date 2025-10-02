"use server"

import prisma from "@/lib/prisma";

export async function getGroups(desktopId: string, cursor?: string, take = 50) {
  if (!desktopId) return [];

  try {
    return await prisma.group.findMany({
      where: { desktopId },
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
      },
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
    });
  } catch {
    return [];
  }
}