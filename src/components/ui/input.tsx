"use client"

import * as React from "react"
import { RegisterOptions, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

type InputProps = {
  label?: string
  id: string
  helperText?: string
  validation?: RegisterOptions
} & React.ComponentProps<"input">

function Input({ 
  className, 
  id,
  type, 
  label, 
  helperText,
  validation,
  ...props 
}: InputProps) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={id}
      rules={validation}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <input
              type={type}
              data-slot="input"
              className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
              )}
              {...props} 
              {...field}
            />
          </FormControl>
          {helperText && (
            <FormDescription>
              {helperText}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
     
  )
}

export { Input }
