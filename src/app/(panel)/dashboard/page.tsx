import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }

  return (
    <main className="container mx-auto px-6 pt-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bem vindo de volta!</h1>
          <h2>Aqui está uma lista de suas tarefas para este mês.</h2>
        </div>
        <div>
          {/* <Menu image={session.user?.image as string} /> */}
        </div>
      </div>
      <section className="mt-6 space-y-6">
      </section>
    </main>
  )
}