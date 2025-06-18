"use server"

import prisma from "@/lib/prisma";

export async function getTasks({ userId }: { userId: string }) {
  if (!userId) return [];

  try {
    const tasks = await prisma.tasksGroup.findMany({
      where: { userId: userId },
      include: {
        tasks: true
      }
    });
    return tasks
  } catch (error) {
    console.log(error);
    return [];
  }
}