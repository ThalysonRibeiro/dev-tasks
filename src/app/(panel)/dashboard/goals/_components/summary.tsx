"use client"
import { endOfWeek, format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Plus } from "lucide-react";
import { Progress, ProgressIndicator } from "@/components/ui/progress-bar";
import { Separator } from "@/components/ui/separator"
import { PedingGoals } from "./peding-goals";
import { goalUndo } from "../_actions/goal-undo";
import { toast } from "react-toastify";
import { PendingGoal, WeekSummaryResponse } from "../_types";

interface SummaryProps {
  data: PendingGoal[];
  summaryData: WeekSummaryResponse;
}



export function Summary({ data, summaryData }: SummaryProps) {
  if (!summaryData.summary) {
    return
  }

  const firstDayOfWeek = format(startOfWeek(new Date()), "d MMM", { locale: ptBR });
  const lastDayOfWeek = format(endOfWeek(new Date()), "d MMM", { locale: ptBR });


  async function handleUndo(goalId: string) {
    if (!goalId) {
      toast.error("Erro ao desfazer meta.");
    }
    try {
      const response = await goalUndo({ id: goalId });
      if (response.erro) {
        toast.error(response.data)
      }
      toast("🙄👀 " + response.data)
    } catch (error) {
      toast.error("Erro ao desfazer meta.");
    }

  }


  return (
    <article className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold capitalize">{firstDayOfWeek} - {lastDayOfWeek}</span>
        <div className="flex gap-2">
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={16} />
              Cadastrar meta
            </Button>
          </DialogTrigger>
          <a href="/dashboard/goals/metrics">
            <Button size="sm" variant="outline">
              Métricas
            </Button>
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <ProgressGoals
          total={summaryData?.summary?.total}
          completed={summaryData?.summary?.completed}
        />

        <Separator />

        <PedingGoals data={data} />

        <div className="flex flex-col gap-6">
          <div className="flex gap-3 justify-between items-center">
            <h2 className="text-xl font-medium">Sua semana</h2>
          </div>
          {summaryData.summary.goalsPerDay.map(({ date, dayOfWeek, goals }) => {
            const formattedDate = format(new Date(date + 'T03:00:00Z'), "d 'de' MMMM", { locale: ptBR });
            return (
              <div key={date} className="flex flex-col gap-4">
                <h3 className="font-medium">
                  <span className="capitalize">{dayOfWeek}</span>{' '}
                  <span className="text-xs">({formattedDate})</span>
                </h3>
                <ul className="flex flex-col gap-3">
                  {goals.map(goal => {
                    const time = format(new Date(goal.completedAt), 'HH:mm')
                    return (
                      <li key={goal.id} className="flex items-center gap-2 justify-between">
                        <div className="flex gap-2">
                          <CheckCircle2 className="size-4 text-primary" />
                          <span className="text-sm inline-flex">
                            Você completou &ldquo;<span className="truncate inline-block max-w-[120px] md:text-clip md:max-w-[470px] font-semibold">{goal.title}</span>&ldquo; às
                            <span className="font-semibold text-primary ml-1">{time}</span>
                          </span>
                        </div>
                        <button
                          className="text-sm cursor-pointer underline"
                          onClick={() => handleUndo(goal.id)}
                        >Desfazer
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <Separator />
              </div>
            )
          })}


        </div>
      </div>

    </article>
  )
}

export function ProgressGoals({
  total,
  completed
}: {
  total: number;
  completed: number;
}) {
  const completedPercentage = Math.round((completed * 100) / total);
  return (
    <div className="space-y-4">
      <Progress max={total} value={completed}>
        <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
      </Progress>
      <div className="flex items-center justify-between text-xs">
        <span>Você completou <span>{completed}</span> de <span>{total}</span> metas nessa semana.</span>
        <span>{completedPercentage}%</span>
      </div>
    </div>
  )
}
