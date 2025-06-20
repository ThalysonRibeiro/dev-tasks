"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Item, Priority, Status } from "@/generated/prisma"
import { format } from "date-fns"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import { colorPriority, colorStatus, priorityMap, statusMap } from "@/utils/colorStatus-priority"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarTerm } from "./calendar-term"
import { updateItem } from "../_actions/update-item"
import { deleteItem } from "../_actions/delete-item"

export function ItemsTables({ items }: { items: Item[] }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [itemInfo, setItemInfo] = useState<Item | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const isPopoverClick = (event.target as Element).closest('[data-radix-popper-content-wrapper]');

        if (!isPopoverClick) {
          setIsEditing(false);
          setItemInfo(null);
        }
      }
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing])

  async function handleItemSave(itemsData: Item) {
    const result = await updateItem({
      itemId: itemsData.id,
      title: itemsData.title,
      status: itemsData.status,
      term: itemsData.term,
      priority: itemsData.priority,
      notes: itemsData.notes,
      description: itemsData.description
    });

    if (result?.error) {
      // Tratar erro (toast, alert, etc.)
      console.error(result.error);
    } else {
      setIsEditing(false);
      setItemInfo(null);
    }
    toast.success("Tarefa atualizada com sucesso!")
  }

  function handleCancel() {
    setIsEditing(false);
    setItemInfo(null);
  }

  function handleDeleteItem(itemId: string) {
    deleteItem(itemId);
    toast.success("Item deletado com sucesso!")
  }
  return (
    <div ref={formRef}>
      <Table className="border-b">
        <TableHeader>
          <TableRow>
            <TableHead>Titulo</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Descrição</TableHead>
            <TableHead className="text-right">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id}>
              <TableCell onClick={() => {
                setIsEditing(true);
                setItemInfo(item)
              }}>
                {isEditing && item.id === itemInfo?.id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (itemInfo) {
                      handleItemSave(itemInfo);
                    }
                  }}>
                    <Input
                      value={itemInfo.title}
                      onChange={(e) => setItemInfo(prev =>
                        prev ? { ...prev, title: e.target.value } : null
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancel();
                        }
                      }}
                      autoFocus
                    />
                  </form>
                ) : (
                  <>{item.title}</>
                )}
              </TableCell>
              <TableCell onClick={() => {
                setIsEditing(true);
                setItemInfo(item)
              }}>
                {isEditing && item.id === itemInfo?.id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (itemInfo) {
                      handleItemSave(itemInfo);
                    }
                  }}>
                    <Input
                      value={itemInfo.notes}
                      onChange={(e) => setItemInfo(prev =>
                        prev ? { ...prev, notes: e.target.value } : null
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancel();
                        }
                      }}
                      autoFocus
                    />
                  </form>
                ) : (
                  <>{item.notes}</>
                )}
              </TableCell>

              <TableCell>
                <Select
                  onValueChange={(value) => {
                    const updatedItem = {
                      ...(itemInfo || item),
                      priority: value as Priority,
                    };

                    console.log("Salvando prioridade:", updatedItem.priority); // Debug

                    setItemInfo(updatedItem);
                    handleItemSave(updatedItem);
                  }}
                >
                  <SelectTrigger className={colorPriority(itemInfo?.priority || item.priority)}>
                    <SelectValue placeholder={priorityMap[item.priority]} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRITICAL" className={colorPriority("CRITICAL")}>CRÍTICO</SelectItem>
                    <SelectItem value="HIGH" className={colorPriority("HIGH")}>ALTO</SelectItem>
                    <SelectItem value="MEDIUM" className={colorPriority("MEDIUM")}>MÉDIO</SelectItem>
                    <SelectItem value="LOW" className={colorPriority("LOW")}>BAIXO</SelectItem>
                    <SelectItem value="STANDARD" className={colorPriority("STANDARD")}>PADRÃO</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell>
                {isEditing && item.id === itemInfo?.id ? (
                  <div >
                    <CalendarTerm
                      initialDate={itemInfo.term}
                      onChange={(dateRange) => {
                        const updatedItem = {
                          ...itemInfo,
                          term: dateRange,
                        };
                        setItemInfo(updatedItem);
                        handleItemSave(updatedItem);
                      }}

                    />
                  </div>
                ) : (
                  <div onClick={() => {
                    setIsEditing(true);
                    setItemInfo(item)
                  }}>
                    {format(item.term, "dd/MM/yyyy")}
                  </div>
                )}
              </TableCell>

              <TableCell>
                <Select
                  onValueChange={(value) => {
                    const updatedItem = {
                      ...(itemInfo || item),
                      status: value as Status,
                    };

                    console.log("Salvando prioridade:", updatedItem.status); // Debug

                    setItemInfo(updatedItem);
                    handleItemSave(updatedItem);
                  }}
                >
                  <SelectTrigger className={colorStatus(itemInfo?.status || item.status)}>
                    <SelectValue placeholder={statusMap[item.status]} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DONE" className={colorStatus("DONE")}>CONCLUÍDO</SelectItem>
                    <SelectItem value="IN_PROGRESS" className={colorStatus("IN_PROGRESS")}>EM ANDAMENTO</SelectItem>
                    <SelectItem value="STOPPED" className={colorStatus("STOPPED")}>INTERROMPIDO</SelectItem>
                    <SelectItem value="NOT_STARTED" className={colorStatus("NOT_STARTED")}>NÃO INICIADO</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="text-right max-w-50 overflow-x-scroll" onClick={() => {
                setIsEditing(true);
                setItemInfo(item)
              }}>
                {isEditing && item.id === itemInfo?.id ? (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (itemInfo) {
                      handleItemSave(itemInfo);
                    }
                  }}>
                    <Input
                      value={itemInfo.description}
                      onChange={(e) => setItemInfo(prev =>
                        prev ? { ...prev, description: e.target.value } : null
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancel();
                        }
                      }}
                      autoFocus
                    />
                  </form>
                ) : (
                  <p>{item.description}</p>
                )}
              </TableCell>

              <TableCell className="text-right">
                <Button
                  onClick={() => handleDeleteItem(item.id)}
                  variant={"ghost"}
                  size={"icon"}
                  className="text-red-500 cursor-pointer"
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}