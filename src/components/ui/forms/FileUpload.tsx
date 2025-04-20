import { RegisterOptions, useFormContext } from "react-hook-form"

import { 
    FormField,
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage, 
} from "@/components/ui/form"
import { cn } from "@/lib/utils"

type FileUploadProps = {
  label?: string
  id: string
  helperText?: string
  validation?: RegisterOptions
  onFileChange?: (file: File | null) => void
} & React.ComponentProps<"input">

export default function FileUpload({
    label,
    id,
    helperText,
    validation,
    className,
    onFileChange,
    ...props
}: FileUploadProps) {
    const { control } = useFormContext()

    return (
        <FormField
            control={control}
            name={id}
            rules={validation}
            render={({ field: { value, onChange, ...fieldProps } }) => {
                const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const files = e.target.files;
                    const file = files && files.length > 0 ? files[0] : null;
                    
                    onChange(files);
                    
                    if (onFileChange) {
                        onFileChange(file);
                    }
                };
                
                return (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <input
                                type="file"
                                data-slot="input"
                                className={cn(
                                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                                    className
                                )}
                                onChange={handleFileChange}
                                {...props} 
                                {...fieldProps}
                            />
                        </FormControl>
                        {helperText && (
                            <FormDescription>
                                {helperText}
                            </FormDescription>
                        )}
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    )
}