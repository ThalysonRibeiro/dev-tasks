"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteGroup(groupId: string) {
  try {
    await prisma.group.delete({
      where: {
        id: groupId,
      }
    });
    revalidatePath("/dashboard");
    return;
  } catch (error) {
    console.log(error);
    return {
      error: "Falha ao deletar grupo"
    }
  }
}