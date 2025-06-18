import { Priority } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"]),
  notes: z.string()
    .min(1, "Notas é obrigatório")
    .max(300, "A nota da terefa deve ter no máximo 300 caracteres."),
  budget: z.coerce.number().min(0).optional(),
});

export interface UseDialogTaskFormProps {
  initialValues?: {
    title: string;
    startDate: Date;
    endDate: Date;
    priority: Priority;
    notes: string;
    budget: number;
  }
}

export type DialogTaskFormData = z.infer<typeof formSchema>;

export function UseDialogTaskForm({ initialValues }: UseDialogTaskFormProps) {
  return useForm<DialogTaskFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      priority: "STANDARD",
      notes: "",
      budget: 0,
    }
  })
}