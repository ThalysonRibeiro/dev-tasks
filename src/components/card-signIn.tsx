"use client"
import { handleRegister, SigInType } from "@/app/(public)/_action/signIn";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader,
  CardTitle
} from "@/components/ui/card";
import { FaGithub } from "react-icons/fa";

export function CardSignIn() {
  async function handleSignIn(proider: SigInType) {
    await handleRegister(proider);
  }
  return (
    <Card className="max-w-100 w-full">
      <CardHeader>
        <CardTitle className="text-center">SignIn</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => handleSignIn("github")}
          className="w-full cursor-pointer">
          <FaGithub /> GitHub
        </Button>
      </CardContent>
    </Card>
  )
}