"use client"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemFormData, UseItemForm } from "./use-item-form";
import { Input } from "@/components/ui/input";
import { Priority, Status } from "@/generated/prisma";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { CalendarTerm } from "./calendar-term";
import { createItem } from "../../_actions/create-item";
import { Textarea } from "@/components/ui/textarea";
import { colorPriority, colorStatus, priorityMap, statusMap } from "@/utils/colorStatus-priority";
import { cn } from "@/lib/utils";
import { updateItem } from "../../_actions/update-item";
import { useMobile } from "@/hooks/use-mobile";

interface CreateItemFormProps {
  closeForm: (value: boolean) => void;
  initialValues?: {
    title: string;
    term: Date;
    priority: Priority;
    status: Status;
    notes: string;
    description: string;
  }
  groupId: string;
  itemId?: string;
  editingItem: boolean;
}

export function CreateOrEditItemForm({ closeForm, initialValues, groupId, itemId, editingItem }: CreateItemFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = UseItemForm({ initialValues });
  const isMobile = useMobile();


  async function onSubmit(formData: ItemFormData) {
    setIsLoading(true);
    try {
      if (editingItem && itemId) {
        const result = await updateItem({
          itemId: itemId,
          title: formData?.title,
          status: formData?.status,
          term: formData?.term,
          priority: formData?.priority,
          notes: formData?.notes,
          description: formData?.description
        });

        if (result?.error) {
          toast.error("Erro ao atualizar item");
        } else {
          toast.success("Item atualizado com sucesso!");
        }
        closeForm(false);
        form.reset();

      } else {
        const response = await createItem({
          groupId: groupId,
          title: formData.title,
          term: formData.term,
          priority: formData.priority,
          notes: formData.notes || "",
          description: formData.description || "",
          status: "NOT_STARTED"
        });
        if (response.error) {
          toast.error("Erro ao cadastrar item");
          return;
        }
        toast.success("Item cadastrado com sucesso!");
        closeForm(false);
        form.reset();
      }
    } catch (error) {
      toast.error("Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary" />
    )
  }

  return (
    <Form {...form}>
      <form className={cn("grid grid-cols-1 gap-4 w-full",
        editingItem ? "lg:grid-cols-1" : "lg:grid-cols-2"
      )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex-1 w-full">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Titulo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="title"
                    placeholder="Digite o nome do item..."
                    aria-describedby="item-name-error"
                    aria-required="true"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Notas adicionais para seu item"
                    className="min-h-65 max-h-65 w-full"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className={cn("", colorPriority(field.value))} size="sm">
                        <SelectValue placeholder={priorityMap["STANDARD"]} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRITICAL" className={colorPriority("CRITICAL")}>Crítico</SelectItem>
                        <SelectItem value="HIGH" className={colorPriority("HIGH")}>Alto</SelectItem>
                        <SelectItem value="MEDIUM" className={colorPriority("MEDIUM")}>Medio</SelectItem>
                        <SelectItem value="LOW" className={colorPriority("LOW")}>Baixo</SelectItem>
                        <SelectItem value="STANDARD" className={colorPriority("STANDARD")}>Padrão</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            {editingItem && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={colorStatus(field.value)} size="sm" >
                          <SelectValue placeholder={statusMap[field.value]} />
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
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo</FormLabel>
                  <FormControl>
                    <CalendarTerm
                      onChange={(date) => {
                        console.log("Data passada:", date);
                        field.onChange(date)
                      }}
                      initialDate={field.value || new Date()} // Adiciona esta linha
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1 w-full">
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descreva seu item aqui..."
                  className="max-h-[500px] min-h-[400px] w-full"
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className={cn("mt-3.5 w-fit px-10"
        )}>
          {editingItem ? 'Salvar' : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  )
}