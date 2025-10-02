"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markAllAsRead() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao marcar todas como lidas" };
  }
}