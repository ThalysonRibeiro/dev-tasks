import { totalItens } from "./dashboard-utils";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GetWeekSummary } from "./goals/_data-access/get-week-summary";
import { ProgressGoals } from "./goals/_components/summary";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { PrioritiesBar } from "./desktop/[id]/_components/priorities-bar";
import { getPriorities } from "./desktop/[id]/_data-access/get-priorities";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginAlert } from "@/components/login-alert";
import { getDetailUser } from "./_data-access/get-detail-user";
import { Item, Prisma } from "@/generated/prisma";
import { getDesktops } from "./_data-access/get-desktops";

export async function Priorities({ desktopId }: { desktopId: string }) {
  const data = await getPriorities(desktopId);
  return (
    <div className="w-full mt-auto">
      <PrioritiesBar priorities={data} label={false} />
    </div>
  )
}

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/')
  }
  const desktops = await getDesktops();
  const weekSummaryDate = await GetWeekSummary();
  const detailUser = await getDetailUser();
  if (!detailUser) return null;
  if (!weekSummaryDate.summary) {
    return null
  }


  return (
    <>
      <LoginAlert emailNotifications={detailUser.UserSettings?.emailNotifications} />
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
                <Card className="relative rounded-none hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 ease-in-out capitalize">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[56px_56px]" />
                  <CardHeader className="p-2">
                    <CardTitle>{desktop.title}</CardTitle>
                    <CardDescription>
                      Total grupos: {desktop.groupe.length}
                      <br />
                      Total tarefas: {totalItens(desktop.groupe)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto w-full p-2">
                    <Priorities desktopId={desktop.id} />
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
    </>
  )
}