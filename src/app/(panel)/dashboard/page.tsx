import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { Header } from "./_components/header";
import { TasksContent } from "./_components/tasks-content";
import { Menu } from "./_components/menu";
import { getTasks } from "./_data-access/get-tasks";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }

  const tasksData = await getTasks({ userId: session.user?.id as string });
  return (
    <main className="container mx-auto px-6 pt-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back!</h1>
          <h2>Here&apos;s a list of your tasks for this month.</h2>
        </div>
        <div>
          <Menu image={session.user?.image as string} />
        </div>
      </div>
      <section className="mt-6 space-y-6">
        <Header />
        <TasksContent tasksData={tasksData || []} />
      </section>
    </main>
  )
}