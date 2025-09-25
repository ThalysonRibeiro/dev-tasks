"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  desktopId: z.string().min(1, "O id é obrigatório"),
  title: z.string().min(1, "O titulo é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateDesktop(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  const existingDesktop = await prisma.desktop.findFirst({
    where: { id: formData.desktopId }
  });
  if (!existingDesktop) {
    return {
      error: "Desktop não encontrada"
    }
  }
  try {
    await prisma.desktop.update({
      where: { id: existingDesktop.id },
      data: { title: formData.title }
    })
    revalidatePath("/dashboard");
    return {
      data: "Desktop atualizada com sucesso!"
    }
  } catch (error) {
    return {
      error: "Falha ao atualizar Desktop"
    }
  }
}