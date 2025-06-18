"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  notes: z.string()
    .min(1, "Notas é obrigatório")
    .max(300, "A nota da terefa deve ter no máximo 300 caracteres."),
  budget: z.coerce.number().min(0).optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createTask(formData: FormSchema) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Falha ao cadastrar tarefa"
    }
  }
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  try {
    const newTask = await prisma.tasks.create({
      data: {
        title: formData.title,
        startDate: formData.startDate || new Date(),
        endDate: formData.endDate || new Date(),
        priority: formData.priority || "STANDARD",
        notes: formData.notes,
        budget: formData.budget || 0,
      }
    });
    revalidatePath("/dashboard");
    return { data: newTask }
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao cadastrar tarefa"
    }
  }
}