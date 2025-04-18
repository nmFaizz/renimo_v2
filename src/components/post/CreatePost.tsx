"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/buttons/Button";
import api from "@/lib/api";
import { ApiErrorResponse } from "@/types/api";

type CreatePostFormValues = {
    text: string;
}

export default function CreatePost() {
    const methods = useForm<CreatePostFormValues>({
        mode: "onTouched",
        defaultValues: {
            text: "",
        }
    });
    const { handleSubmit } = methods;
    const queryClient = useQueryClient();

    const { mutate: createPost, isPending } = useMutation<void, ApiErrorResponse, CreatePostFormValues>({
        mutationFn: async (data: CreatePostFormValues) => {
            await api.post("/api/post", data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post created successfully!");
        },
        onError: (e) => {
            toast.error(e.response.data.error);
        }
    });

    const handleCreatePost: SubmitHandler<CreatePostFormValues> = (data) => {
        createPost(data);
        methods.reset(); 
    }

    return (
        <Form {...methods}>
            <form 
                onSubmit={handleSubmit(handleCreatePost)}
                className="flex flex-col gap-4"
            >
                <Textarea
                    id="text"
                    placeholder="Write your post here..."
                    className="resize-none h-[120px]"
                    validation={{
                        required: "This field is required",
                        minLength: {
                            value: 1,
                            message: "Post must be at least 1 character long",
                        },
                        maxLength: {
                            value: 500,
                            message: "Post must be at most 500 characters long",
                        },
                    }}
                >

                </Textarea>

                <div className="flex justify-end w-full">
                    <Button
                        type="submit"
                        className="w-[120px]"
                        isLoading={isPending}
                    >
                        Post
                    </Button>
                </div>

            </form>
        </Form>
    )
}