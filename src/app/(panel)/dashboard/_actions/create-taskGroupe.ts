"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
  textColor: z.string().min(4, "O titulo é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createTakGroup(formData: FormSchema) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Falha ao cadastrar grupo"
    }
  }
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  try {
    const newGroup = await prisma.tasksGroup.create({
      data: {
        userId: session.user.id,
        title: formData.title,
        textColor: formData.textColor,
      }
    });
    revalidatePath("/dashboard");
    return { data: newGroup }
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao cadastrar grupo"
    }
  }
}