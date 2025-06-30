import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GetWeekSummary } from "./goals/_data-access/get-week-summary";
import { ProgressGoals } from "./goals/_components/summary";
import { getDesktops } from "./desktop/[id]/_data-access/get-desktops";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const desktops = await getDesktops();
  const weekSummaryDate = await GetWeekSummary();
  if (!weekSummaryDate.summary) {
    return null
  }

  return (
    <main className="container mx-auto px-6 pt-6">
      <section className="flex flex-col justify-between space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Bem vindo de volta!</h1>
          <h2>Aqui está uma seu resumo.</h2>
        </div>
        <div className="flex flex-wrap">
          {desktops.map(desktop => (
            <Link
              href={`/dashboard/desktop/${desktop.id}`}
              key={desktop.id}
              className="border border-dashed rounded-full hover:border-primary text-center capitalize font-bold py-2 px-4">
              <p>{desktop.title}</p>
            </Link>
          ))}
        </div>
        <Separator />
        {weekSummaryDate?.summary?.total > 0 ? (
          <div className="w-full space-y-4">
            <h3>Progresso das suas metas</h3>
            <ProgressGoals
              total={weekSummaryDate?.summary?.total}
              completed={weekSummaryDate?.summary?.completed}
            />
          </div>
        ) : (
          <p>Cadastre metas e acompanhe sua evolução</p>
        )}
      </section>
    </main>
  )
}