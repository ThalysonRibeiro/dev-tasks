import { CardSignIn } from "@/components/card-signIn";
import Image from "next/image";
import logo_img from "@/assets/logo-goallist.png";

export default function Home() {
  return (
    <main className="container mx-auto w-full h-screen flex flex-col gap-6 justify-center items-center px-6">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[44px_44px]" />
      <h1 className="text-3xl font-bold uppercase bg-linear-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent inline-flex gap-2 items-center">
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
