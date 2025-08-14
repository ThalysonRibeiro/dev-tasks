import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GetWeekSummary } from "./goals/_data-access/get-week-summary";
import { ProgressGoals } from "./goals/_components/summary";
import { getDesktops } from "./desktop/[id]/_data-access/get-desktops";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { PrioritiesBar } from "./desktop/[id]/_components/priorities-bar";
import { Desktop } from "@/generated/prisma";
import { getPriorities } from "./desktop/[id]/_data-access/get-priorities";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  const prioritiesData = async (desktopId: string) => {
    const data = await getPriorities(desktopId);
    return (
      <div className="w-full mt-auto">
        <PrioritiesBar priorities={data} label={false} />
      </div>
    )
  }


  return (
    <main className="container mx-auto px-6 pt-6">
      <section className="flex flex-col justify-between space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Bem vindo de volta!</h1>
          <h2>Aqui está seu resumo.</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {desktops.map(desktop => (
            <Link
              href={`/dashboard/desktop/${desktop.id}`}
              key={desktop.id}
            >
              <Card className="relative rounded-none hover:border-primary/50 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/20 hover:bg-violet-900/10 transition-all duration-300 ease-in-out capitalize">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[56px_56px]" />
                <CardHeader className="p-2">
                  <CardTitle>{desktop.title}</CardTitle>
                  <CardDescription>Total itens: {desktop.groupe.length}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto w-full p-2">
                  {prioritiesData(desktop.id)}
                </CardContent>
              </Card>
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