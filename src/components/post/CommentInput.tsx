import { SubmitHandler, useForm } from "react-hook-form"
import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query"

import { 
    Form
} from "@/components/ui/form"
import { toast } from "sonner"
import { ApiErrorResponse } from "@/types/api"
import api from "@/lib/api"
import { Button } from "../ui/buttons/Button"
import { Textarea } from "../ui/textarea"

type CommentInputProps = {
    id: number
}

type CommentInputFormValues = {
    text: string 
}

type CommentPayload = {
    text: string
    parent_id: number
}

export default function CommentInput({
    id,
}: CommentInputProps) {
    const methods = useForm({
        mode: "onTouched",
        defaultValues: {
            text: ""
        }
    })
    const { handleSubmit } = methods
    const queryClient = useQueryClient()

    const { mutate: createComment, isPending } = useMutation<
        void, 
        ApiErrorResponse, 
        CommentPayload
    >({
        mutationFn: async (data: CommentPayload) => {
            return api.post(`/api/post`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", id] })
            toast.success("Comment posted")
        },
        onError: (error) => {
            console.error("Error creating comment:", error)
        }
    })

    const onSubmit: SubmitHandler<CommentInputFormValues> = (data) => {
        const payload = {
            text: data.text,
            parent_id: Number(id)
        }

        createComment(payload)
        methods.reset()
    }

    return (
        <Form {...methods}>
            <form 
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col space-x-2">
                    <Textarea
                        id="text"
                        placeholder="write a comment..."
                    />
                    <Button
                        type="submit"
                        isLoading={isPending}
                        className="w-max mt-2"
                    >
                        Send
                    </Button>

                </div>
            </form>
        </Form>
    )
}