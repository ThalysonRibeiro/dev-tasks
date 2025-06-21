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
import { useCallback, useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import { colorPriority, colorStatus, priorityMap, statusMap } from "@/utils/colorStatus-priority"
import { Trash, Check, X, CircleAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CalendarTerm } from "./calendar-term"
import { updateItem } from "../_actions/update-item"
import { deleteItem } from "../_actions/delete-item"
import { Textarea } from "@/components/ui/textarea"

type EditingField = 'title' | 'notes' | 'description' | 'term' | null;

interface EditingState {
  itemId: string | null;
  field: EditingField;
}

export function ItemsTables({ items }: { items: Item[] }) {
  const [editing, setEditing] = useState<EditingState>({ itemId: null, field: null });
  const [editingData, setEditingData] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const isEditing = (itemId: string, field: EditingField) =>
    editing.itemId === itemId && editing.field === field;

  const startEditing = useCallback((item: Item, field: EditingField) => {
    setEditing({ itemId: item.id, field });
    setEditingData({ ...item });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditing({ itemId: null, field: null });
    setEditingData(null);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const isPopoverClick = (event.target as Element).closest('[data-radix-popper-content-wrapper]');
        if (!isPopoverClick) {
          cancelEditing();
        }
      }
    }

    if (editing.itemId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editing.itemId, cancelEditing]);

  const handleSaveField = useCallback(async (item: Item) => {
    if (!editingData) return;

    setIsLoading(item.id);

    try {
      const result = await updateItem({
        itemId: item.id,
        title: editingData.title,
        status: editingData.status,
        term: editingData.term,
        priority: editingData.priority,
        notes: editingData.notes,
        description: editingData.description
      });

      if (result?.error) {
        toast.error("Erro ao atualizar item");
        console.error(result.error);
      } else {
        toast.success("Item atualizado com sucesso!");
        cancelEditing();
      }
    } catch (error) {
      toast.error("Erro ao atualizar item");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  }, [editingData, cancelEditing]);

  const handleSelectChange = useCallback(async (item: Item, field: 'priority' | 'status', value: Priority | Status) => {
    setIsLoading(item.id);

    try {
      const result = await updateItem({
        itemId: item.id,
        title: item.title,
        status: field === 'status' ? value as Status : item.status,
        term: item.term,
        priority: field === 'priority' ? value as Priority : item.priority,
        notes: item.notes,
        description: item.description
      });

      if (result?.error) {
        toast.error("Erro ao atualizar item");
        console.error(result.error);
      } else {
        toast.success("Item atualizado!");
      }
    } catch (error) {
      toast.error("Erro ao atualizar item");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  }, []);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    setIsLoading(itemId);

    try {
      await deleteItem(itemId);
      toast.success("Item deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar item");
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  }, []);

  const renderEditableCell = (item: Item, field: EditingField, value: string | null) => {
    if (isEditing(item.id, field) && field) {
      const fieldValue = editingData?.[field] as string || '';

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveField(item);
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={fieldValue}
            onChange={(e) => setEditingData(prev =>
              prev ? { ...prev, [field]: e.target.value } : null
            )}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancelEditing();
              if (e.key === 'Enter') handleSaveField(item);
            }}
            autoFocus
            disabled={isLoading === item.id}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            disabled={isLoading === item.id}
            className="text-green-600 hover:text-green-700"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={cancelEditing}
            disabled={isLoading === item.id}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
      );
    }

    return (
      <div
        onClick={() => startEditing(item, field)}
        className="cursor-pointer hover:bg-accent p-1 rounded transition-colors"
        title="Clique para editar"
      >
        {value || 'Clique para editar'}
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        Nenhum item encontrado
      </div>
    );
  }

  return (
    <div ref={formRef}>
      <Table className="border-b">
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Notas</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow key={item.id} className={isLoading === item.id ? 'opacity-50' : ''}>
              {/* Título */}
              <TableCell>
                {renderEditableCell(item, 'title', item.title)}
              </TableCell>

              {/* Notas */}
              <TableCell className="max-w-65">
                <div className="max-w-65 overflow-hidden">
                  {isEditing(item.id, 'notes') && 'notes' ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveField(item);
                      }}
                      className="flex items-start gap-2"
                    >
                      <Textarea
                        value={editingData?.notes || ''}
                        onChange={(e) => setEditingData(prev =>
                          prev ? { ...prev, notes: e.target.value } : null
                        )}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') cancelEditing();
                          if (e.key === 'Enter' && e.ctrlKey) handleSaveField(item);
                        }}
                        autoFocus
                        disabled={isLoading === item.id}
                        className="max-h-[120px] w-full"
                        placeholder="Digite as notas..."
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          disabled={isLoading === item.id}
                          className="text-green-600 hover:text-green-700"
                          title="Salvar (Ctrl + Enter)"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={cancelEditing}
                          disabled={isLoading === item.id}
                          className="text-red-600 hover:text-red-700"
                          title="Cancelar (Esc)"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div
                      onClick={() => startEditing(item, 'notes')}
                      className="cursor-pointer hover:bg-accent p-2 rounded transition-colors min-h-[40px] group"
                      title="Clique para editar"
                    >
                      {item.notes ? (
                        <div className="space-y-1">
                          <p className="text-sm overflow-hidden text-ellipsis" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.4em',
                            maxHeight: '2.8em'
                          }}>
                            {item.notes}
                          </p>
                          {item.notes.length > 100 && (
                            <span className="text-xs text-blue-600 group-hover:text-blue-800">
                              Clique para ver mais...
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">
                          Clique para adicionar notas
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Prioridade */}
              <TableCell>
                <Select
                  onValueChange={(value) => handleSelectChange(item, 'priority', value as Priority)}
                  disabled={isLoading === item.id}
                >
                  <SelectTrigger className={colorPriority(item.priority)}>
                    <SelectValue placeholder={priorityMap[item.priority]} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRITICAL" className={colorPriority("CRITICAL")}>
                      CRÍTICO
                    </SelectItem>
                    <SelectItem value="HIGH" className={colorPriority("HIGH")}>
                      ALTO
                    </SelectItem>
                    <SelectItem value="MEDIUM" className={colorPriority("MEDIUM")}>
                      MÉDIO
                    </SelectItem>
                    <SelectItem value="LOW" className={colorPriority("LOW")}>
                      BAIXO
                    </SelectItem>
                    <SelectItem value="STANDARD" className={colorPriority("STANDARD")}>
                      PADRÃO
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              {/* Prazo */}
              <TableCell>
                {isEditing(item.id, 'term') ? (
                  <div className="flex items-center gap-2">
                    <CalendarTerm
                      initialDate={editingData?.term || item.term}
                      onChange={(dateRange) => {
                        setEditingData(prev => prev ? { ...prev, term: dateRange } : null);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSaveField(item)}
                      disabled={isLoading === item.id}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={cancelEditing}
                      disabled={isLoading === item.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Indicador visual baseado no status e prazo */}
                    {new Date(item.term) < new Date() && (
                      <div className="flex items-center gap-1">
                        {item.status === 'DONE' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <CircleAlert className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    )}

                    <div
                      onClick={() => startEditing(item, 'term')}
                      className={`cursor-pointer hover:bg-accent p-1 rounded transition-colors ${new Date(item.term) < new Date() && item.status !== 'DONE'
                        ? 'text-red-600 font-semibold'
                        : ''
                        }`}
                      title="Clique para editar"
                    >
                      {format(item.term, "dd/MM/yyyy")}
                    </div>
                  </div>
                )}
              </TableCell>

              {/* Status */}
              <TableCell>
                <Select
                  onValueChange={(value) => handleSelectChange(item, 'status', value as Status)}
                  disabled={isLoading === item.id}
                >
                  <SelectTrigger className={colorStatus(item.status)}>
                    <SelectValue placeholder={statusMap[item.status]} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DONE" className={colorStatus("DONE")}>
                      CONCLUÍDO
                    </SelectItem>
                    <SelectItem value="IN_PROGRESS" className={colorStatus("IN_PROGRESS")}>
                      EM ANDAMENTO
                    </SelectItem>
                    <SelectItem value="STOPPED" className={colorStatus("STOPPED")}>
                      INTERROMPIDO
                    </SelectItem>
                    <SelectItem value="NOT_STARTED" className={colorStatus("NOT_STARTED")}>
                      NÃO INICIADO
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              {/* Descrição */}
              <TableCell className="max-w-65">
                <div className="max-w-65 overflow-hidden">
                  {isEditing(item.id, 'description') && 'description' ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveField(item);
                      }}
                      className="flex items-start gap-2"
                    >
                      <Textarea
                        value={editingData?.description || ''}
                        onChange={(e) => setEditingData(prev =>
                          prev ? { ...prev, description: e.target.value } : null
                        )}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') cancelEditing();
                          if (e.key === 'Enter' && e.ctrlKey) handleSaveField(item);
                        }}
                        autoFocus
                        disabled={isLoading === item.id}
                        className="max-h-[120px] w-full"
                        placeholder="Digite a descrição..."
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          type="submit"
                          size="sm"
                          variant="ghost"
                          disabled={isLoading === item.id}
                          className="text-green-600 hover:text-green-700"
                          title="Salvar (Ctrl + Enter)"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={cancelEditing}
                          disabled={isLoading === item.id}
                          className="text-red-600 hover:text-red-700"
                          title="Cancelar (Esc)"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div
                      onClick={() => startEditing(item, 'description')}
                      className="cursor-pointer hover:bg-accent p-2 rounded transition-colors min-h-[40px] group"
                      title="Clique para editar"
                    >
                      {item.description ? (
                        <div className="space-y-1">
                          <p className="text-sm overflow-hidden text-ellipsis" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: '1.4em',
                            maxHeight: '2.8em'
                          }}>
                            {item.description}
                          </p>
                          {item.description.length > 100 && (
                            <span className="text-xs text-blue-600 group-hover:text-blue-800">
                              Clique para ver mais...
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">
                          Clique para adicionar descrição
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Ações */}
              <TableCell className="text-right">
                <Button
                  onClick={() => handleDeleteItem(item.id)}
                  variant="ghost"
                  size="icon"
                  disabled={isLoading === item.id}
                  className="cursor-pointer border border-dashed text-gray-600 hover:text-red-600 hover:border-red-300"
                  title="Deletar item"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}