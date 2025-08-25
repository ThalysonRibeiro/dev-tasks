"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface CompletionCardProps {
  title: string;
  weeks: string[];
  type: "completed" | "incompleted";
}

export function CompletionCard({ title, weeks, type }: CompletionCardProps) {
  const Icon = type === "completed" ? CheckCircle : XCircle;
  const color = type === "completed" ? "text-green-500" : "text-red-500";

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Icon className={`w-6 h-6 ${color}`} />
        {title}
      </h2>
      <div className="grid grid-cols-4 gap-2 mt-4">
        {weeks.map((week) => (
          <div key={week} className="p-2 border rounded-md text-center">
            {week}
          </div>
        ))}
      </div>
    </div>
  );
}
