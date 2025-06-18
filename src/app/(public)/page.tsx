import { CardSignIn } from "@/components/card-signIn";
import { FaTasks } from "react-icons/fa";

export default function Home() {
  return (
    <main className="container mx-auto w-full h-screen flex flex-col gap-6 justify-center items-center px-6">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[44px_44px]" />
      <h1 className="text-3xl font-bold uppercase bg-linear-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent inline-flex gap-2 items-center">
        <FaTasks className="text-violet-500" /> dev tasks
      </h1>
      <CardSignIn />
    </main>
  );
}
