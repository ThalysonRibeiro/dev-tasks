import { MetricsContent } from "./_components/metrics-content";
import { getGoalsMetrics } from "./_data-access/get-goals-metrics";

export default async function MetricsPage() {
  const metrics = await getGoalsMetrics();

  return (
    <main className="container mx-auto px-6 pt-6">
      <MetricsContent data={metrics} />
    </main>
  );
}
