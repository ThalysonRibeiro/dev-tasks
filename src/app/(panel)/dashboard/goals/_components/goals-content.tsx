"use client"

import {
  Sheet
} from "@/components/ui/sheet"
import { CreateGoals } from "./create-goals"
import { EmptyGoal } from "./empyt-goal"
import { Summary } from "./summary"
import { PendingGoal, WeekSummaryResponse } from "../_types"


interface GoalsContentProps {
  data: PendingGoal[];
  summaryData: WeekSummaryResponse
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
