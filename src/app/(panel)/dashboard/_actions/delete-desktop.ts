"use server"
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function deleteDesktop(desktopId: string) {
  const existingDesktop = await prisma.desktop.findFirst({
    where: { id: desktopId }
  });
  if (!existingDesktop) {
    return {
      error: "Áreas de trabalho não encontrada"
    }
  }
  try {
    await prisma.desktop.delete({
      where: { id: existingDesktop.id }
    });
    revalidatePath("/dashboard");
    return {
      data: "Áreas de trabalho deletada com sucesso!"
    };
  } catch (error) {
    console.log(error);
    return {
      error: "Áreas de trabalho não encontrada"
    }
  }
}