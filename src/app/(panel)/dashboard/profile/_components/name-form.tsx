"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "next-auth";
import { useState } from "react";
import { UseNameForm } from "./use-name-form";
import { Button } from "@/components/ui/button";
import { updateName } from "../_actions/update-name";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

export function NameForme({ user }: { user: User }) {
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const form = UseNameForm({ initialValues: { name: user?.name || "" } });

  async function onSubmit(formData: { name: string }) {
    if (!user.id) return;
    try {
      const response = await updateName({
        userId: user.id,
        name: formData.name
      });
      if (response?.error) {
        toast.error(response.error);
        return;
      }
      toast.success("Nome alterado com sucesso!");
      setIsAdding(false);
    } catch (error) {
      toast.error("Erro ao atualizar nome");
    }
  }

  return (
    <div className={cn("border rounded-lg relative w-full", isAdding ? "p-0" : "p-4")}>

      <button
        onClick={() => setIsAdding(!isAdding)}
      >
        {isAdding ? (
          <span className="absolute bottom-2 right-2 px-2 py-1 border border-dashed border-red-400 text-red-400 rounded-md text-center text-sm">
            Cancelar
          </span>
        ) : (
          <div className="space-x-1">
            <label className="label">
              <span className="label-text">Nome:</span>
            </label>
            <span title="Nome do usuário clique para editar" className="text-center text-sm cursor-pointer">
              {user.name}
            </span>
          </div>
        )}
      </button>
      {isAdding && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-2 p-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu nome"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size={"sm"}
              className=""
            >
              Salvar
            </Button>
          </form>
        </Form>
      )
      }

    </div >
  )
}