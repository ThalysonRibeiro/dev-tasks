import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const nameFormSchema = z.object({
  name: z.string()
    .min(3, "O nome deve conter ao menos 3 caractere")
    .max(100, "O nome deve conter no máximo 100 caracteres"),
});

export interface UseNameFormProps {
  initialValues?: {
    name: string;
  }
}

export type NameFormData = z.infer<typeof nameFormSchema>;

export function UseNameForm({ initialValues }: UseNameFormProps) {
  return useForm<NameFormData>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: initialValues || {
      name: "",
    }
  })
}

const settingsFormSchema = z.object({
  pushNotifications: z.boolean(),
  emailNotifications: z.boolean(),
  language: z.string(),
  timezone: z.string(),
});

export interface UseSettingsFormProps {
  initialValues?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    timezone: string;
  }
}

export type SettingsFormData = z.infer<typeof settingsFormSchema>;

export function UseSettingsForm({ initialValues }: UseSettingsFormProps) {
  return useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialValues || {
      emailNotifications: true,
      pushNotifications: true,
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
    }
  })
}