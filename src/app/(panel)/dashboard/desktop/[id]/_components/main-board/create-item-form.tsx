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
import { Priority } from "@/generated/prisma";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { CalendarTerm } from "./calendar-term";
import { createItem } from "../../_actions/create-item";

interface CreateItemFormProps {
  closeForm: (value: boolean) => boolean;
  initialValues?: {
    title: string;
    term: Date;
    priority: Priority;
    notes: string;
    description: string;
  }
  groupId: string;
}

export function CreateItemsForm({ closeForm, initialValues, groupId }: CreateItemFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const form = UseItemForm({ initialValues });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const isPopoverClick = (event.target as Element).closest('[data-radix-popper-content-wrapper]');
        if (!isPopoverClick) {
          closeForm(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeForm]);

  async function onSubmit(formData: ItemFormData) {
    setIsLoading(true);
    try {
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
      form.reset();
    } catch (error) {
      toast.error("Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <p>carregando...</p>
    )
  }

  return (
    <div ref={formRef}>
      <Form {...form}>
        <form className="flex justify-between items-center gap-4 px-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Descreva seu item"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
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
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CRITICAL">Crítico</SelectItem>
                      <SelectItem value="HIGH">Alto</SelectItem>
                      <SelectItem value="MEDIUM">Medio</SelectItem>
                      <SelectItem value="LOW">Baixo</SelectItem>
                      <SelectItem value="STANDARD">Padrão</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prazo</FormLabel>
                <FormControl>
                  <CalendarTerm
                    onChange={(date) => {
                      field.onChange(date)
                    }}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Descreva o item"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-3.5">Cadastrar</Button>
        </form>
      </Form>
    </div>
  )
}