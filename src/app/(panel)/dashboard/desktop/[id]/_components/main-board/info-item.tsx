"use client"
import { Button } from "@/components/ui/button"
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Item } from "@/generated/prisma"
import { cn } from "@/lib/utils"
import { colorPriority, colorStatus, priorityMap, statusMap } from "@/utils/colorStatus-priority"
import { Edit } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { CreateOrEditItemForm } from "./create-or-edit-item-form"

export function InfoItem({ data }: { data: Item }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const shetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shetRef.current && !shetRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing])

  return (
    <SheetContent ref={shetRef} className="overflow-y-scroll min-w-100 md:min-w-150 w-full">
      <Button className="w-fit ml-4 mt-4 border-dashed" variant={"outline"}
        onClick={() => setIsEditing(prev => !prev)}
      >
        {isEditing ? 'Cancelar' : 'Editar'} <Edit />
      </Button>
      {isEditing ? (
        <>
          <div className="p-4 space-y-4">
            <CreateOrEditItemForm
              closeForm={() => setIsEditing(false)}
              initialValues={{
                title: data.title,
                term: data.term,
                priority: data.priority,
                status: data.status,
                notes: data.notes,
                description: data.description
              }}
              groupId={""}
              itemId={data.id}
              editingItem={true}
            />
          </div>
        </>
      ) : (
        <>
          <SheetHeader>
            <SheetTitle>
              {data.title[0].toUpperCase()}
              {data.title.slice(1)}
            </SheetTitle>
            <SheetDescription>
              {data.notes}
            </SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-4">

            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span>
                  Prioridade:
                </span>
                <span className={cn("px-2 py-1 w-fit rounded-lg", colorPriority(data.priority))}>
                  {priorityMap[data.priority]}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>
                  Status:
                </span>
                <span className={cn("px-2 py-1 w-fit rounded-lg", colorStatus(data.status))}>
                  {statusMap[data.status]}
                </span>
              </div>
            </div>

            <div className="text-sm">
              <span>
                Descrição:
              </span>
              <p className="mt-1 text-zinc-400 italic bg-zinc-900 p-2 rounded-lg border">
                {data.description}
              </p>
            </div>
          </div>
        </>
      )}
    </SheetContent>
  )
}