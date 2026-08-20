import { useForm as useRHFForm, UseFormReturn, UseFormProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"

interface CustomFormProps<T extends z.ZodType<any, any, any>> extends Omit<UseFormProps<z.infer<T>>, "resolver"> {
  schema?: T
}

export function useForm<T extends z.ZodType<any, any, any>>({
  schema,
  ...props
}: CustomFormProps<T> = {}): UseFormReturn<z.infer<T>> {
  return useRHFForm<z.infer<T>>({
    ...props,
    resolver: schema ? (zodResolver(schema) as any) : undefined,
    mode: props.mode || "onChange",
  }) as any
}
