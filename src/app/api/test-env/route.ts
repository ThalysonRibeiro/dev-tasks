import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Teste de variáveis de ambiente",
    hasGithubId: !!process.env.GITHUB_ID,
    hasGithubSecret: !!process.env.GITHUB_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    timestamp: new Date().toISOString()
  });
}
