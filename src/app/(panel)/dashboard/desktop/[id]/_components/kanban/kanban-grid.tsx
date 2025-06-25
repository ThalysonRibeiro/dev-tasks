"use client"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { KanbanProps } from "./kanbam-content";
import { Item, Status } from "@/generated/prisma";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { updateItem } from "../../_actions/update-item";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogContentNewItem } from "./dialog-new-item";
import { Button } from "@/components/ui/button";
import { borderColorPriority, borderColorStatus, priorityMap, statusMap } from "@/utils/colorStatus-priority";

export function KanbanGrid({ groupsData }: KanbanProps) {
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const [isCloseDialog, setIsCloseDialog] = useState<boolean>(false);
  const [getStatus, setGetStatus] = useState<Status>("NOT_STARTED");
  const items: Item[] = [];
  groupsData.forEach((groupStatus) => {
    if (Array.isArray(groupStatus.item)) {
      items.push(...groupStatus.item);
    } else {
      items.push(groupStatus.item);
    }
  });

  function handleDragStart(e: React.DragEvent, item: Item) {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";

    // Criar preview customizado
    const dragPreview = document.createElement('div');
    dragPreview.className = 'bg-white border-2 border-violet-500 rounded-lg p-3 shadow-lg max-w-xs opacity-90';
    dragPreview.innerHTML = `
      <div class="font-medium text-gray-900">${item.title}</div>
      <div class="text-sm text-gray-500 mt-1">${item.status}</div>
      <div class="text-sm text-gray-500">${format(new Date(item.term), "dd/MM/yyyy")}</div>
    `;

    // Posicionar fora da tela
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-1000px';
    dragPreview.style.left = '-1000px';

    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);

    // Remover após um tempo
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
  }

  async function handleDrop(e: React.DragEvent, status: Status) {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== status) {
      await updateItem({
        itemId: draggedItem.id,
        status: status,
        description: draggedItem.description,
        notes: draggedItem.notes,
        priority: draggedItem.priority,
        title: draggedItem.title
      });;
    }
    setDraggedItem(null);
  }

  const statusConfig = [
    {
      status: "DONE" as Status,
      title: "Concluído",
      bgColor: "bg-green-500",
      count: items.filter(item => item.status === "DONE").length
    },
    {
      status: "IN_PROGRESS" as Status,
      title: "Em Progresso", // CORREÇÃO: título mais apropriado
      bgColor: "bg-blue-500",
      count: items.filter(item => item.status === "IN_PROGRESS").length
    },
    {
      status: "STOPPED" as Status,
      title: "Parado",
      bgColor: "bg-red-500",
      count: items.filter(item => item.status === "STOPPED").length
    },
    {
      status: "NOT_STARTED" as Status,
      title: "Não Iniciado", // CORREÇÃO: título mais apropriado
      bgColor: "bg-zinc-500",
      count: items.filter(item => item.status === "NOT_STARTED").length
    }
  ];


  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {statusConfig.map((config) => (
        <Card
          key={config.status}
          className={`pt-0 overflow-hidden transition-all duration-200 ${draggedItem ? 'border border-dashed border-violet-500 bg-zinc-600/50' : ''
            }`}
          onDrop={(e) => handleDrop(e, config.status)}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <CardHeader className={`${config.bgColor} py-4`}>
            <CardTitle className="text-white">{config.title} ({config.count})</CardTitle>
            <CardDescription></CardDescription>
            <CardAction>
              <Dialog open={isCloseDialog} onOpenChange={setIsCloseDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="cursor-pointer hover:bg-transparent"
                    onClick={() => setGetStatus(config.status)}
                  >
                    <Plus className="text-white" />
                  </Button>
                </DialogTrigger>
                <DialogContentNewItem groups={groupsData} closeDialog={setIsCloseDialog} status={getStatus} />
              </Dialog>
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-2 px-2 max-h-[65vh] overflow-auto">
            {items
              .filter(item => item.status === config.status)
              .map(item => (
                <div
                  key={item.id}
                  className={`space-y-1 text-sm border rounded bg-background p-2 cursor-move kanban-item hover:shadow-md transition-all duration-200 ${draggedItem?.id === item.id ? 'opacity-50 scale-95 rotate-2' : ''
                    }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                >
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="flex gap-4 text-muted-foreground">
                    <p className={`text-xs border-l-4 pl-1 ${borderColorStatus(item.status)}`}>{statusMap[item.status]}</p>
                    <p className={`text-xs border-l-4 pl-1 ${borderColorPriority(item.priority)}`}>{priorityMap[item.priority]}</p>
                  </div>
                  <p className="text-xs">{format(new Date(item.term), "dd/MM/yyyy")}</p>
                  {item.notes && <h4 className="text-sm mt-2">{item.notes}</h4>}
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

