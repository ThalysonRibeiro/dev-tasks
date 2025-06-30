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
import { GroupFormData, UseGroupForm } from "./use-group-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateGroup } from "../../_actions/update-group";
import { createGroup } from "../../_actions/create-groupe";


interface CreateGroupFormProps {
  setAddGroup: (value: boolean) => boolean;
  groupId?: string;
  initialValues?: {
    title: string;
    textColor: string;
  }
  desktopId: string;
}

export function GroupForm({ setAddGroup, initialValues, groupId, desktopId }: CreateGroupFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);

  const form = UseGroupForm({ initialValues: initialValues });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setAddGroup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setAddGroup]);

  async function onSubmit(formData: GroupFormData) {
    setIsLoading(true);

    if (groupId) {
      await updateGroup({
        id: groupId,
        title: formData.title,
        textColor: formData.textColor
      });
      setIsLoading(false);
      setAddGroup(false)
      toast.success("Grupo atualizado com sucesso!");
      return;
    }

    try {
      const response = await createGroup({
        desktopId: desktopId,
        title: formData.title,
        textColor: formData.textColor,
      });
      if (response.error) {
        toast.error("Erro ao cadastrar grupo");
        return;
      }
      toast.success("Grupo cadastrado com sucesso!");
      setAddGroup(false);
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
                    aria-describedby="group-name-error"
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
                    aria-describedby="group-name-error"
                    aria-required="true"
                    className="w-8 border-0 p-0"
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