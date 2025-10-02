"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { auth } from "@/lib/auth";
import { NotificationType } from "@/generated/prisma";

const formSchema = z.object({
  userId: z.string().min(1, "O id é obrigatório"),
  referenceId: z.string().optional(),
  title: z.string().min(1, "O titulo é obrigatório"),
  message: z.string().min(1, "A mensagem é obrigatória"),
  type: z.enum([
    NotificationType.FRIEND_REQUEST,
    NotificationType.FRIEND_ACCEPTED,
    NotificationType.DESKTOP_INVITE,
    NotificationType.ITEM_ASSIGNED,
    NotificationType.CHAT_MESSAGE
  ]),
});

type FormSchema = z.infer<typeof formSchema>;

export async function sendNotification(formData: FormSchema) {
  const session = await auth();
  if (!session?.user) {
    return {
      error: "Falha ao cadastrar notificação"
    }
  }

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    // Sempre valida se o usuário existe
    const userExists = await existingUser(formData.userId);
    if (!userExists) {
      return {
        error: "Usuário não encontrado"
      }
    }

    switch (formData.type) {
      case "CHAT_MESSAGE":
      case "FRIEND_REQUEST":
      case "FRIEND_ACCEPTED":
        return await createNotification(formData);

      case "DESKTOP_INVITE":
        if (!formData.referenceId) {
          return { error: "ID do desktop é obrigatório" }
        }
        const existingDesktop = await prisma.desktop.findFirst({
          where: { id: formData.referenceId }
        });
        if (!existingDesktop) {
          return { error: "Desktop não encontrado" }
        }
        return await createNotification(formData);

      case "ITEM_ASSIGNED":
        if (!formData.referenceId) {
          return { error: "ID do item é obrigatório" }
        }
        const existingItem = await prisma.item.findFirst({
          where: { id: formData.referenceId }
        });
        if (!existingItem) {
          return { error: "Item não encontrado" }
        }
        return await createNotification(formData);

      default:
        return { error: "Tipo de notificação inválido" }
    }
  } catch (error) {
    console.error(error);
    return {
      error: "Falha ao cadastrar notificação"
    }
  }
}

async function createNotification(formData: FormSchema) {
  return await prisma.notification.create({
    data: {
      userId: formData.userId,
      type: formData.type,
      message: formData.message,
      referenceId: formData.referenceId
    }
  });
}

async function existingUser(userId: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: { id: userId }
  });
  return !!user;
}