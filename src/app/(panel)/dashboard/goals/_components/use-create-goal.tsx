import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Informe a atividade qeu deseja realizar"),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

export interface UseCreateGoalFormProps {
  initialValues?: {
    title: string;
    desiredWeeklyFrequency: number;
  }
}

export type CreateGoalForm = z.infer<typeof formSchema>;

export function UseCreateGoalForm({ initialValues }: UseCreateGoalFormProps) {
  return useForm<CreateGoalForm>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      desiredWeeklyFrequency: 0,
    }
  })
}