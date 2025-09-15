import { getDetailUser } from "../_data-access/get-detail-user";
import { GoalsContent } from "./_components/goals-content";
import { getWeekPendingGoal } from "./_data-access/get-week-pendingGoal";
import { GetWeekSummary } from "./_data-access/get-week-summary";

export default async function GoalsPage() {
  const pedingGoals = await getWeekPendingGoal();
  const weekSummaryDate = await GetWeekSummary();
  const detailUser = await getDetailUser();
  if (!detailUser) return null;
  const { UserSettings } = detailUser;

  const timezone = UserSettings?.timezone ?? "America/Sao_Paulo";
  const language = UserSettings?.language ?? "pt-BR";

  return (
    <main className="container mx-auto px-6 pt-10">
      <GoalsContent
        data={pedingGoals}
        summaryData={weekSummaryDate}
        timeZone={timezone}
        language={language}
      />
    </main>
  )
}
