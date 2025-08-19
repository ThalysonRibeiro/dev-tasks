import { colorStatus, statusKeys, statusMap } from "@/utils/colorStatus-priority";
import { StatusCount } from "../_data-access/get-status";
import { Status } from "@/generated/prisma";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  status: StatusCount[];
}

export function StatusBar({ status }: StatusBarProps) {
  const total = status.reduce((acc, s) => acc + s.count, 0);

  return (
    <div className="relative group">
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
      <div className="flex justify-between gap-2 capitalize text-xs bg-zinc-900 rounded-lg border border-primary p-2.5 w-full absolute top-5 inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {statusKeys.map(key => (
          <div key={key} className="flex items-center">
            <div className={cn("w-3 h-3 rounded mr-1", colorStatus(key))} />
            {statusMap[key as keyof typeof statusMap].toLowerCase()}
          </div>
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
