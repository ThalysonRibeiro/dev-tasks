"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { NotificationType } from "@/generated/prisma";

// Nova action específica para broadcasts
const broadcastSchema = z.object({
  message: z.string().min(1, "A mensagem é obrigatória"),
  type: z.enum(["SISTEM_MESSAGE", "NOTICES_MESSAGE"]),
  referenceId: z.string().optional(),
});

export async function sendBroadcastNotification(
  formData: z.infer<typeof broadcastSchema>
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Não autenticado" };
  }

  const schema = broadcastSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  }

  try {
    const result = await sendNotificationAllUsers({
      type: formData.type,
      message: formData.message,
      referenceId: formData.referenceId
    });
    return { success: true, totalSend: result.totalSend };
  } catch (error) {
    console.error("Erro ao enviar broadcast:", error);
    return { error: "Falha ao enviar notificação" };
  }
}

async function sendNotificationAllUsers({
  type, message, referenceId
}: {
  type: NotificationType;
  message: string;
  referenceId?: string;
}) {
  const users = await prisma.user.findMany({
    select: { id: true }
  });

  const result = await prisma.notification.createMany({
    data: users.map(user => ({
      userId: user.id,
      type,
      message,
      referenceId: referenceId || null,
    })),
    skipDuplicates: true,
  });

  return {
    success: true,
    totalSend: result.count,
  };
}


//  const handleSendAllUsers = async () => {
//     const result = await sendBroadcastNotification({
//       message: "Manutenção programada para amanhã às 22h",
//       type: "SISTEM_MESSAGE",
//     });

//     if ('error' in result) {
//       toast.error(result.error);
//     } else {
//       toast.success(`Enviado para ${result.totalSend} usuários`);
//     }
//   };