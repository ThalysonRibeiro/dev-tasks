"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function deleteDesktop(desktopId: string) {
  const existingDesktop = await prisma.desktop.findFirst({
    where: { id: desktopId }
  });
  if (!existingDesktop) {
    return {
      error: "Desktop não encontrada"
    }
  }
  try {
    await prisma.desktop.delete({
      where: { id: existingDesktop.id }
    });
    revalidatePath("/dashboard");
    return {
      data: "Desktop deletada com sucesso!"
    };
  } catch (error) {
    return {
      error: "Falha ao deletar Desktop"
    }
  }
}