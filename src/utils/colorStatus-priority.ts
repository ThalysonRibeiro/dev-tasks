export function colorStatus(status: string): string {
  switch (status) {
    case "DONE":
      return "bg-green-500 dark:bg-green-500 text-white";
    case "IN_PROGRESS":
      return "bg-blue-500 dark:bg-blue-500 text-white";
    case "STOPPED":
      return "bg-red-500 dark:bg-red-500 text-white";
    default:
      return "bg-zinc-400 dark:bg-zinc-400 text-white";
  }
}
export function borderColorStatus(status: string): string {
  switch (status) {
    case "DONE":
      return "border-green-500 dark:border-green-500";
    case "IN_PROGRESS":
      return "border-blue-500 dark:border-blue-500";
    case "STOPPED":
      return "border-red-500 dark:border-red-500";
    default:
      return "border-zinc-400 dark:border-zinc-400";
  }
}

export const statusMap = {
  DONE: "CONCLUÍDO",
  IN_PROGRESS: "EM ANDAMENTO",
  STOPPED: "INTERROMPIDO",
  NOT_STARTED: "NÃO INICIADO",
}

export const statusKeys = ["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"];

export function colorPriority(status: string): string {
  switch (status) {
    case "CRITICAL":
      return "bg-red-500 dark:bg-red-500 text-white";
    case "HIGH":
      return "bg-orange-500 dark:bg-orange-500 text-white";
    case "MEDIUM":
      return "bg-yellow-500 dark:bg-yellow-500 text-white";
    case "LOW":
      return "bg-green-500 dark:bg-green-500 text-white";
    default:
      return "bg-zinc-400 dark:bg-zinc-400 text-white";
  }
}
export function borderColorPriority(status: string): string {
  switch (status) {
    case "CRITICAL":
      return "border-red-500 dark:border-red-500";
    case "HIGH":
      return "border-orange-500 dark:border-orange-500";
    case "MEDIUM":
      return "border-yellow-500 dark:border-yellow-500";
    case "LOW":
      return "border-green-500 dark:border-green-500";
    default:
      return "border-zinc-400 dark:border-zinc-400";
  }
}

export const priorityMap = {
  CRITICAL: "CRÍTICO",
  HIGH: "ALTO",
  MEDIUM: "MÉDIO",
  LOW: "BAIXO",
  STANDARD: "PADRÃO",
}

export const priorityKeys = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"];



