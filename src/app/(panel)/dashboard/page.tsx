import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { GetWeekSummary } from "./goals/_data-access/get-week-summary";
import { ProgressGoals } from "./goals/_components/summary";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginAlert } from "@/components/login-alert";
import { getDetailUser } from "./_data-access/get-detail-user";
import { getDesktops } from "./_data-access/get-desktops";
import { Priorities } from "./_components/priorities";
import { Plus } from "lucide-react";
import FolderAnimation from "@/components/folder-animation";

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
      <LoginAlert emailNotifications={detailUser.userSettings?.emailNotifications} />
      <main className="container mx-auto px-6 pt-6">
        <section className="flex flex-col justify-between space-y-4">
          <div>
            <h1 className="text-2xl font-semibold">Bem vindo de volta!</h1>
            <h2>Aqui está seu resumo.</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            <Card className="relative hover:border-primary/50 bg-gradient-to-b from-card hover:from-primary/10 to-card hover:to-orange-500/20 transition-all duration-300 ease-in-out capitalize">
              <CardHeader>
                <CardTitle>Adicionar desktop</CardTitle>
                <CardDescription>Criar uma nova área de trabalho</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <Plus className="w-15 h-15 opacity-25" strokeWidth={.5} />
              </CardContent>
            </Card>
            {desktops.map(desktop => (
              <Link
                href={`/dashboard/desktop/${desktop.id}`}
                key={desktop.id}
              >
                <FolderAnimation>
                  <Card className="relative rounded-none border-0 shadow-none bg-transparent capitalize">
                    <CardHeader className="p-2">
                      <CardTitle>{desktop.title}</CardTitle>
                      <CardDescription>
                        Total grupos: {desktop.groupsCount}
                        <br />
                        Total tarefas: {desktop.itemsCount}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto w-full p-2">
                      <Priorities desktopId={desktop.id} />
                    </CardContent>
                  </Card>
                </FolderAnimation>
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