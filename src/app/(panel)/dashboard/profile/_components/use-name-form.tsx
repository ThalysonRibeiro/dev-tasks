import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string()
    .min(3, "O nome deve conter ao menos 3 caractere")
    .max(100, "O nome deve conter no máximo 100 caracteres"),
});

export interface UseNameFormProps {
  initialValues?: {
    name: string;
  }
}

export type NameFormData = z.infer<typeof formSchema>;

export function UseNameForm({ initialValues }: UseNameFormProps) {
  return useForm<NameFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: "",
    }
  })
}