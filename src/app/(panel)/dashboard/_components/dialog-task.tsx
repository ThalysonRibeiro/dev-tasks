"use client"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DialogTaskFormData, UseDialogTaskForm } from "./dialog-task-form";
import { Input } from "@/components/ui/input";
import { Priority } from "@/generated/prisma";
import { DateCalendar } from "./deadline-calendar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { createTask } from "../_actions/create-task";
import { toast } from "react-toastify";

interface DialogTaskProps {
  closeModal?: () => void;
  initialValues?: {
    title: string;
    deadline: Date;
    priority: Priority;
    notes: string;
    budget: number;
    schedule: Date;
  }
}

export function DialogTask({ initialValues }: DialogTaskProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = UseDialogTaskForm({ initialValues });

  async function onSubmit(formData: DialogTaskFormData) {
    setIsLoading(true);
    try {
      const response = await createTask({
        title: formData.title,
        deadline: formData.deadline,
        priority: formData.priority,
        notes: formData.notes,
        budget: formData.budget,
        schedule: formData.schedule,
      });
      if (response.error) {
        toast.error("Erro ao cadastrar tarefa");
        return;
      }
      toast.success("Tarefa cadastrada com sucesso!");
    } catch (error) {
      console.log(error);

      toast.error("Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Cadastrar tarefa</DialogTitle>
        <DialogDescription>
          Preencha os dados para Cadastrar a tarefa
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Digite o nome da tarefa..."
                    aria-describedby="task-name-error"
                    aria-required="true"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-4">
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
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo</FormLabel>
                  <FormControl>
                    <DateCalendar onChange={(date) => {
                      field.onChange(date)
                    }} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Descreva sua tarefa"
                    className="max-h-20 h-10"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-4">
            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orçamento</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="budget"
                      placeholder="0"
                      type="number"
                      aria-describedby="task-name-error"
                      aria-required="true"
                      tabIndex={-1}
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cronograma</FormLabel>
                  <FormControl>
                    <DateCalendar onChange={(date) => {
                      field.onChange(date)
                    }} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="w-full">
            {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Cadastrar"}
          </Button>
        </form>
      </Form>
    </>

  )
}