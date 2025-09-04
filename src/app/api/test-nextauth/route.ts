import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({
      message: "NextAuth funcionando",
      hasSession: !!session,
      user: session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email
      } : null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      message: "Erro no NextAuth",
      error: error instanceof Error ? error.message : "Erro desconhecido",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
