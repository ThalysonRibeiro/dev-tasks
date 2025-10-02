"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteNotification(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return { error: "Notificação não encontrada" };
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao deletar notificação" };
  }
}