"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTaskGroup(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Falha ao deletar grupo"
    }
  }
  try {
    await prisma.tasksGroup.delete({
      where: {
        id: id,
        userId: session.user.id
      }
    });
    revalidatePath("/dashboard");
    return;
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao deletar grupo"
    }
  }
}