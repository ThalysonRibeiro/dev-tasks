"use client"

import {
  Sheet
} from "@/components/ui/sheet"
import { CreateGoals } from "./create-goals"
import { EmptyGoal } from "./empyt-goal"
import { Summary } from "./summary"
import { GoalsCompletedByWeekDayType } from "../_data-access/get-week-summary"

export type GoalsWithCompletions = {
  id: string
  title: string
  desiredWeeklyFrequency: number
  completionCount: number
};

interface GoalsContentProps {
  data: GoalsWithCompletions[];
  summaryData: SummaryDataProps
}

export type SummaryDataProps = {
  error: string;
  summary?: undefined;
} | {
  summary: {
    completed: number;
    total: number;
    goalsPerDay: Record<string, GoalsCompletedByWeekDayType[]>;
  };
  error?: undefined;
}


export function GoalsContent({ data, summaryData }: GoalsContentProps) {
  return (
    <section>
      <Sheet>
        {data.length > 0 ? <Summary data={data} summaryData={summaryData} /> : <EmptyGoal />}

        <CreateGoals />
      </Sheet>
    </section>
  )
}