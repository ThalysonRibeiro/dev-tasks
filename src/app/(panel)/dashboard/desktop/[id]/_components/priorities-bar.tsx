import { PrioritiesCount } from "../_data-access/get-priorities";

interface PrioritiesBarProps {
  priorities: PrioritiesCount[];
  label?: boolean;
}

export function PrioritiesBar({ priorities, label = true }: PrioritiesBarProps) {
  const total = priorities.reduce((acc, priority) => acc + priority.count, 0);

  return (
    <div>
      {label && <h3 className="font-semibold text-sm">Prooridade</h3>}
      <div className="flex w-full h-6 rounded-md overflow-hidden">
        {priorities.map((priority) => (
          <div
            key={priority.priority}
            className={`h-full`}
            style={{
              width: `${(priority.count / total) * 100}%`,
              backgroundColor: getPriorityColor(priority.priority),
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "CRITICAL":
      return "#ef4444";
    case "HIGH":
      return "#f97316";
    case "MEDIUM":
      return "#eab308";
    case "LOW":
      return "#22c55e";
    default:
      return "#6b7280";
  }
}
