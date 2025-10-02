"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteMultipleNotifications(notificationIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id, // Segurança: só deleta as do usuário
      },
    });

    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao deletar notificações" };
  }
}