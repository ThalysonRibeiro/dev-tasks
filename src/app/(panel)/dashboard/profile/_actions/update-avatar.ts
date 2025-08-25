"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function updateAvatar({ avatarUrl }: { avatarUrl: string }) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Usuário não encontrado"
    }
  }
  if (!avatarUrl || avatarUrl === "") {
    return {
      error: "Flaha ao alterar imagem."
    }
  }
  try {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        image: avatarUrl
      }
    })

    revalidatePath("/dashboard/profile");

    return {
      success: "Imagem alterada com sucesso!"
    }
  } catch (error) {
    return {
      error: "Falha ao alterar imagem."
    }
  }
}