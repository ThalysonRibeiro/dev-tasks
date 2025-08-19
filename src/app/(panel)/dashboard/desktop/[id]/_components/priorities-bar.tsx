import { colorPriority, priorityKeys, priorityMap } from "@/utils/colorStatus-priority";
import { PrioritiesCount } from "../_data-access/get-priorities";
import { cn } from "@/lib/utils";

interface PrioritiesBarProps {
  priorities: PrioritiesCount[];
  label?: boolean;
}

export function PrioritiesBar({ priorities, label = true }: PrioritiesBarProps) {
  const total = priorities.reduce((acc, priority) => acc + priority.count, 0);

  return (
    <div className="relative group">
      {label && <h3 className="font-semibold text-sm">Prioridade geral</h3>}
      <div className=" flex w-full h-4 rounded-md overflow-hidden">
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
      <div className="flex justify-between gap-2 capitalize text-xs bg-zinc-900 rounded-lg border border-primary p-2.5 w-full absolute top-5 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {priorityKeys.map(key => (
          <div key={key} className="flex items-center">
            <div className={cn("w-3 h-3 rounded mr-1", colorPriority(key))} />
            {priorityMap[key as keyof typeof priorityMap].toLowerCase()}
          </div>
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
