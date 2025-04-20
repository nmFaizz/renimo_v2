"use client"

import { useForm } from "react-hook-form";

import { 
    Form 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import ButtonLink from "../ui/links/ButtonLink";

export default function SearchPost({ 
    className,
    ...props
}: React.ComponentProps<"form">) {
    const methods = useForm({
        mode: "onTouched",
        defaultValues: {
            text: ""
        }
    })
    const { watch } = methods

    const search = watch("text")

    return (
        <Form {...methods}>
            <form 
                className={cn("w-full", className)}
                {...props}
            >
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full">
                        <Input 
                            id="text"
                            type="text" 
                            placeholder="Search posts..." 
                            className="w-full p-2 border rounded"
                            validation={{
                                required: true,
                                minLength: {
                                    value: 3,
                                    message: "Minimum length is 3 characters"
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Maximum length is 100 characters"
                                }
                            }}
                        />
                    </div>
                    <ButtonLink 
                        type="submit" 
                        className="p-2 text-white bg-blue-500 rounded"
                        href={`/home/${search}`}
                    >
                        <Search />
                    </ButtonLink>
                </div>
            </form>
        </Form>
    )
}       