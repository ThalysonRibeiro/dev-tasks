"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  desktopId: z.string().min(1, "O id é obrigatório"),
  title: z.string().min(1, "O titulo é obrigatório"),
  textColor: z.string().min(4, "O titulo é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createGroup(formData: FormSchema) {
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
      error: "Falha ao cadastrar grupo"
    }
  }
  try {
    const newGroup = await prisma.group.create({
      data: {
        desktopId: existingDesktop.id,
        title: formData.title,
        textColor: formData.textColor,
      }
    });
    revalidatePath("/dashboard/desktop");
    return { data: newGroup }
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao cadastrar grupo"
    }
  }
}