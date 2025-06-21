"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createDesktop(formData: FormSchema) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Falha ao cadastrar Desktop"
    }
  }
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    const newDesktop = await prisma.desktop.create({
      data: {
        userId: session.user?.id,
        title: formData.title,
      }
    });

    revalidatePath("/dashboard");
    return { newDesktop };
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao cadastrar Desktop"
    }
  }
}