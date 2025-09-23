"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getDesktops() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }
  try {
    const desktops = await prisma.desktop.findMany({
      where: { userId: session.user.id },
      include: {
        groupe: {
          include: {
            item: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return desktops;
  } catch (error) {
    return [];
  }
}