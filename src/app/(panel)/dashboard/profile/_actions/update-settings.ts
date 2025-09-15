"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const settingsFormSchema = z.object({
  userId: z.string().min(1, "O id do usuário é obrigatório"),
  pushNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  language: z.string(),
  timezone: z.string(),
});

type SettingsFormData = z.infer<typeof settingsFormSchema>;

export async function updateSettings(formData: SettingsFormData) {
  const schema = settingsFormSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  const existingUserSettings = await prisma.user.findUnique({
    where: { id: formData.userId },
  });

  if (!existingUserSettings) {
    return {
      error: "Usuário não encontrado"
    }
  }
  try {
    await prisma.userSettings.update({
      where: { userId: existingUserSettings.id },
      data: {
        emailNotifications: formData.emailNotifications,
        pushNotifications: formData.pushNotifications,
        language: formData.language,
        timezone: formData.timezone
      }
    });
    revalidatePath("/dashboard/profile");
    return {
      success: "Configurações atualizadas com sucesso!"
    }
  } catch (error) {
    return {
      error: "Falha ao atualizar configurações"
    }
  }

}