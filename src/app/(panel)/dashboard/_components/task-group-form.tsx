"use client"
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { TaskGroupFormData, UseTaskGroupForm } from "./taskGroup-form";
import { useEffect, useRef, useState } from "react";
import { createTakGroup } from "../_actions/create-taskGroupe";
import { toast } from "react-toastify";
import { updateTaskGroup } from "../_actions/update-taskGroup";

interface CreateTaskGroupFormProps {
  setAddTaskGroup: (value: boolean) => boolean;
  groupId?: string;
  initialValues?: {
    title: string;
    textColor: string;
  }
}

export function TaskGroupForm({ setAddTaskGroup, initialValues, groupId }: CreateTaskGroupFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);

  const form = UseTaskGroupForm({ initialValues: initialValues });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setAddTaskGroup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setAddTaskGroup]);

  async function onSubmit(formData: TaskGroupFormData) {
    setIsLoading(true);

    if (groupId) {
      await updateTaskGroup({
        id: groupId,
        title: formData.title,
        textColor: formData.textColor
      });
      setIsLoading(false);
      setAddTaskGroup(false)
      toast.success("Grupo atualizado com sucesso!");
      return;
    }

    try {
      const response = await createTakGroup({
        title: formData.title,
        textColor: formData.textColor,
      });
      if (response.error) {
        toast.error("Erro ao cadastrar grupo");
        return;
      }
      toast.success("Grupo cadastrado com sucesso!");
      setAddTaskGroup(false);
    } catch (error) {
      console.log(error);
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
        <form className="flex gap-4 max-w-100" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    id="title"
                    placeholder="Digite o nome do grupo"
                    aria-describedby="task-group-name-error"
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
            name="textColor"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    id="textColor"
                    type="color"
                    aria-describedby="task-group-name-error"
                    aria-required="true"
                    className="w-10 border-0 p-0"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}