import { GoalsContent } from "./_components/goals-content";
import { getWeekPendingGoal } from "./_data-access/get-week-pendingGoal";
import { GetWeekSummary } from "./_data-access/get-week-summary";

export default async function GoalsPage() {
  const pedingGoals = await getWeekPendingGoal();
  const weekSummaryDate = await GetWeekSummary();

  return (
    <main className="container mx-auto px-6 pt-6">
      <GoalsContent data={pedingGoals} summaryData={weekSummaryDate} />
    </main>
  )
}
