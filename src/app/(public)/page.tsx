import { CardSignIn } from "@/components/card-signIn";
import Image from "next/image";
import logo_img from "@/assets/logo-goallist.png";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect('/dashboard');
  }
  return (
    <main className="w-full h-screen flex flex-col gap-6 justify-center items-center px-6 bg-radial from-violet-600/10 via-zinc-950/0 to-zinc-950/0">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[44px_44px]" />
      <h1 className="text-5xl font-bold uppercase bg-linear-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent inline-flex gap-2 items-center">
        <Image
          src={logo_img}
          alt="imagem do logo"
          width={50}
          height={50}
        />
        dev tasks
      </h1>
      <CardSignIn />
    </main>
  );
}
