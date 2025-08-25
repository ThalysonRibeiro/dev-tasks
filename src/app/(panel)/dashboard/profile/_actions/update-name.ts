"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  userId: z.string().min(1, "O id do usuário é obrigatório"),
  name: z.string().min(3, "O nome deve conter ao menos 3 caractere").max(100, "O nome deve conter no máximo 100 caracteres"),
});


type FormSchema = z.infer<typeof formSchema>;

export async function updateName(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);

  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  const existingUser = await prisma.user.findUnique({
    where: { id: formData.userId }
  });

  if (!existingUser) {
    return {
      error: "Usuário não encontrado"
    }
  }

  try {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        name: formData.name,
      }
    });
    revalidatePath("/dashboard/profile");
  } catch (error) {
    return {
      error: "Falha ao atualizar nome"
    }
  }
}