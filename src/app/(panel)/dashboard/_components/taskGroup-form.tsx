import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
  textColor: z.string().min(4, "O titulo é obrigatório"),
});

export interface UseTaskGroupFormProps {
  initialValues?: {
    title: string;
    textColor: string;
  }
}

export type TaskGroupFormData = z.infer<typeof formSchema>;

export function UseTaskGroupForm({ initialValues }: UseTaskGroupFormProps) {
  return useForm<TaskGroupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
      textColor: "#AD46FF"
    }
  })
}