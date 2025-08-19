export function colorStatus(status: string): string {
  switch (status) {
    case "DONE":
      return "bg-green-500";
    case "IN_PROGRESS":
      return "bg-blue-500";
    case "STOPPED":
      return "bg-red-500 text-white";
    default:
      return "bg-zinc-400";
  }
}
export function borderColorStatus(status: string): string {
  switch (status) {
    case "DONE":
      return "border-green-500";
    case "IN_PROGRESS":
      return "border-blue-500";
    case "STOPPED":
      return "border-red-500";
    default:
      return "border-zinc-400";
  }
}

export const statusMap = {
  DONE: "CONCLUÍDO",
  IN_PROGRESS: "EM ANDAMENTO",
  STOPPED: "INTERROMPIDO",
  NOT_STARTED: "NÃO INICIADO",
}

export const statusKeys = ['DONE', 'IN_PROGRESS', 'STOPPED', 'NOT_STARTED'];

export function colorPriority(status: string): string {
  switch (status) {
    case "CRITICAL":
      return "bg-red-500";
    case "HIGH":
      return "bg-orange-500";
    case "MEDIUM":
      return "bg-yellow-500";
    case "LOW":
      return "bg-green-400";
    default:
      return "bg-zinc-400";
  }
}
export function borderColorPriority(status: string): string {
  switch (status) {
    case "CRITICAL":
      return "border-red-500";
    case "HIGH":
      return "border-orange-500";
    case "MEDIUM":
      return "border-yellow-500";
    case "LOW":
      return "border-green-400";
    default:
      return "border-zinc-400";
  }
}

export const priorityMap = {
  CRITICAL: "CRÍTICO",
  HIGH: "ALTO",
  MEDIUM: "MÉDIO",
  LOW: "BAIXO",
  STANDARD: "PADRÃO",
}

export const priorityKeys = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'STANDARD'];



