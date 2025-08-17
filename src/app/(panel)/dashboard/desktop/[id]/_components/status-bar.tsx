import { StatusCount } from "../_data-access/get-status";
import { Status } from "@/generated/prisma";

interface StatusBarProps {
  status: StatusCount[];
}

export function StatusBar({ status }: StatusBarProps) {
  const total = status.reduce((acc, s) => acc + s.count, 0);

  return (
    <div>
      <h3 className="font-semibold text-sm">Status geral</h3>
      <div className="flex w-full h-4 rounded-md overflow-hidden">
        {status.map((s) => (
          <div
            key={s.status}
            className={`h-full`}
            style={{
              width: `${(s.count / total) * 100}%`,
              backgroundColor: getStatusColor(s.status as Status),
            }}
          />
        ))}
      </div>
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
    default:
      return "#6b7280";
  }
}
