import { Item, Status } from "@/generated/prisma";

interface GroupProgressBarProps {
  items: Item[];
}

export function GroupProgressBar({ items }: GroupProgressBarProps) {
  const total = items.length;
  if (total === 0) {
    return null;
  }

  const statusCounts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<Status, number>);

  return (
    <div className="flex w-full max-w-75 h-6 rounded-md overflow-hidden">
      {Object.entries(statusCounts).map(([status, count]) => (
        <div
          key={status}
          className={`h-full`}
          style={{
            width: `${(count / total) * 100}%`,
            backgroundColor: getStatusColor(status as Status),
          }}
        />
      ))}
    </div>
  );
}

function getStatusColor(status: Status) {
  switch (status) {
    case "DONE":
      return "#22c55e";
    case "IN_PROGRESS":
      return "#3b82f6";
    case "STOPPED":
      return "#ef4444";
    // case "NOT_STARTED":
    //   return "#eab308";
    default:
      return "#6b7280";
  }
}
