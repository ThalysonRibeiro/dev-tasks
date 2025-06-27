"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  goalId: z.string().min(1, "o id da meta é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function goalCompletion(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  const existingGoal = await prisma.goals.findFirst({
    where: { id: formData.goalId }
  });
  if (!existingGoal) {
    return {
      error: "Meta não encontrada."
    }
  }
  try {
    const completionCount = await prisma.goalCompletions.count({
      where: {
        goalId: formData.goalId,
      }
    });
    if (completionCount >= existingGoal.desiredWeeklyFrequency) {
      return {
        error: "Limite de conclusão atingido nesta semana."
      }
    }
    await prisma.goalCompletions.create({
      data: {
        goalId: existingGoal.id,
      }
    });
    revalidatePath("/dashboard/desktop");
    return { data: `parabêns você completou a meta ${existingGoal.title}.` };
  } catch (error) {
    console.log(error);
    return {
      error: "Erro ao completar meta."
    }
  }
}