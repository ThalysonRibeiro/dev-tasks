"use client";

import { GoalMetrics } from "../_types";
import { WeeklyProgressChart } from "./charts/weekly-progress-chart";
import { MonthlyProgressChart } from "./charts/monthly-progress-chart";
import { CompletionCard } from "./CompletionCard";

interface MetricsContentProps {
  data: GoalMetrics | null;
}

export function MetricsContent({ data }: MetricsContentProps) {
  if (!data) {
    return <div>Não há dados para exibir</div>;
  }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Métricas de Metas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Progresso Semanal</h2>
          <WeeklyProgressChart data={data.weeklyProgress} />
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">Progresso Mensal</h2>
          <MonthlyProgressChart data={data.monthlyProgress} />
        </div>
        <CompletionCard
          title="Semanas de Conclusão Total"
          weeks={data.completedWeeks}
          type="completed"
        />
        <CompletionCard
          title="Semanas sem Conclusão"
          weeks={data.incompletedWeeks}
          type="incompleted"
        />
      </div>
    </section>
  );
}
