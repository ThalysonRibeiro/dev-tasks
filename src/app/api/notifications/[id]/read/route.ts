import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  await prisma.notification.update({
    where: { id: params.id, userId: session.user.id },
    data: { isRead: true }
  });
  return NextResponse.json({ success: true });
}