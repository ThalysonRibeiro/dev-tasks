"use server"

import prisma from "@/lib/prisma";

export async function getGroups({ desktopId }: { desktopId: string }) {
  if (!desktopId) return [];

  try {
    const groupes = await prisma.group.findMany({
      where: { desktopId: desktopId },
      include: {
        item: true
      }
    });
    return groupes
  } catch (error) {
    return [];
  }
}