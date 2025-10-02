"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteReadNotifications() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    const result = await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
        isRead: true,
      },
    });

    revalidatePath("/dashboard/notifications");
    return { success: true, count: result.count };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao deletar notificações" };
  }
}