import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "O titulo é obrigatório"),
});

export interface UseDesktopProps {
  initialValues?: {
    title: string;
  }
}

export type DesktopFormData = z.infer<typeof formSchema>;

export function UseDesktop({ initialValues }: UseDesktopProps) {
  return useForm<DesktopFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      title: "",
    }
  })
}

