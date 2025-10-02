"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function smartCleanup() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Não autorizado" };
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Deleta lidas com +30 dias
    const deletedRead = await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
        isRead: true,
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    // Deleta não lidas com +90 dias
    const deletedUnread = await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
        isRead: false,
        createdAt: { lt: ninetyDaysAgo },
      },
    });

    // Mantém apenas as 100 mais recentes
    const allNotifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    let deletedOld = 0;
    if (allNotifications.length > 100) {
      const toDelete = allNotifications.slice(100);
      const result = await prisma.notification.deleteMany({
        where: {
          id: { in: toDelete.map(n => n.id) },
        },
      });
      deletedOld = result.count;
    }

    const totalDeleted = deletedRead.count + deletedUnread.count + deletedOld;

    revalidatePath("/dashboard/notifications");
    return {
      success: true,
      deleted: {
        isRead: deletedRead.count,
        unread: deletedUnread.count,
        old: deletedOld,
        total: totalDeleted
      }
    };
  } catch (error) {
    console.error(error);
    return { error: "Erro ao limpar notificações" };
  }
}
