"use client"
import { handleRegister, SigInType } from "@/app/(public)/_action/signIn";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader,
  CardTitle
} from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export function CardSignIn() {
  async function handleSignIn(provider: SigInType) {
    await handleRegister(provider);
  }
  return (
    <Card className="max-w-100 w-full">
      <CardHeader>
        <CardTitle className="text-center">SignIn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => handleSignIn("github")}
          className="w-full cursor-pointer bg-background hover:bg-background border hover:border-primary">
          <FaGithub /> GitHub
        </Button>
        <Button
          onClick={() => handleSignIn("github")}
          className="w-full cursor-pointer bg-background hover:bg-background border hover:border-primary">
          <FcGoogle /> Google
        </Button>
      </CardContent>
    </Card>
  )
}