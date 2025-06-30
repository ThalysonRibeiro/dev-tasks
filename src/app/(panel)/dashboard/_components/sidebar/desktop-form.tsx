"use client"
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useRef, useState } from "react";
import { DesktopFormData, UseDesktop } from "./use-desktop-form";
import { createDesktop } from "../../_actions/create-desktop";
import { toast } from "react-toastify";
import { updateDesktop } from "../../_actions/update-desktop";

interface DesktopFormProps {
  setAddDesktop: (value: boolean) => boolean;
  desktopId?: string;
  initialValues?: {
    title: string;
  }
}




export function DesktopForm({ setAddDesktop, desktopId, initialValues }: DesktopFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);

  const form = UseDesktop({ initialValues: initialValues });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setAddDesktop(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setAddDesktop]);

  async function onSubmit(formData: DesktopFormData) {
    setIsLoading(true);

    if (desktopId) {
      const response = await updateDesktop({
        desktopId: desktopId,
        title: formData.title
      });
      setIsLoading(false);
      setAddDesktop(false);
      if (response.error) {
        toast.error(response.error);
      }
      toast.success(response.data);
    } else {
      try {
        const response = await createDesktop({
          title: formData.title
        });
        if (response.error) {
          toast.error("Erro ao cadastrar Desktop");
          return;
        }
        toast.success("Desktop cadastrada com sucesso!");
        setAddDesktop(false);
        form.reset();
      } catch (error) {
        toast.error("Erro inesperado");
      }
      finally {
        setIsLoading(false);
      }
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {desktopId !== undefined
                    ? "Atualizar Desktop"
                    : "Adicionar Desktop"
                  }
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="title"
                    autoFocus
                    placeholder="Digite o nome da Desktop"
                    aria-describedby="desktop-name-error"
                    aria-required="true"
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