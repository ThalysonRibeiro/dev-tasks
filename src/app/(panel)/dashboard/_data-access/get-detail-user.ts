"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getDetailUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: { select: { sessions: true, } },
        goals: {
          include: {
            goalCompletions: true
          }
        }
      }
    });
    return user;
  } catch (error) {
    return null;
  }
}