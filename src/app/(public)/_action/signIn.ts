"use server"

import { signIn } from "@/lib/auth";

export type SigInType = "github" | "google";

export async function handleRegister(proider: SigInType) {
  await signIn(proider, { redirectTo: "/dashboard" });
}