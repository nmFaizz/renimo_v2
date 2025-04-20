"use client"
import Link from "next/link"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { Heart, MessageCircle, Trash, Edit, X, Check } from "lucide-react"
import { toast } from "sonner"
import { Fragment, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"

import { 
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/buttons/Button"
import api from "@/lib/api"
import { ApiErrorResponse } from "@/types/api"
import UserAvatar from "@/components/UserAvatar"
import { Textarea } from "@/components/ui/textarea"
import { IndexPostResponse } from "@/lib/post"
import { Skeleton } from "../ui/skeleton"
import CommentInput from "./CommentInput"
import Comments from "./Comments"

type PostCardProps = {
    id: number
    text: string
    total_likes: number
    parent_id?: number | null
    user: {
        username: string
        name: string
        image_url?: string | null
    },
    isMine?: boolean
}

type EditPostFormValues = {
    text: string
}

export default function PostCard({
    id,
    text,
    total_likes,
    parent_id,
    isMine,
    user,
}: PostCardProps) {
    const [commentOpen, setCommentOpen] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const queryClient = useQueryClient()
    
    const methods = useForm<EditPostFormValues>({
        mode: "onTouched",
        defaultValues: {
            text: text
        }
    })
    const { handleSubmit } = methods

    const { mutate: deletePost } = useMutation<
        void, 
        ApiErrorResponse, 
        number
    >({
        mutationFn: async (postId: number) => {
            await api.delete(`/api/post/${postId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
            toast.success("Post deleted successfully!")
        },
        onError: (e) => {
            const message = e.response.data.error
            toast.error(message);
        }
    })

    const { mutate: likePost, isPending: isLiking } = useMutation<
        void, 
        ApiErrorResponse, 
        number
    >({
        mutationFn: async (postId: number) => {
            await api.put(`/api/likes/${postId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
            toast.success("Post liked successfully!")
        },
        onError: (e) => {
            const message = e.response.data.error
            toast.error(message);
        }
    })
    
    const { mutate: updatePost, isPending: isUpdating } = useMutation<
        void,
        ApiErrorResponse,
        { text: string }
    >({
        mutationFn: async (data) => {
            await api.put(`/api/post/${id}`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] })
            setIsEditing(false)
            toast.success("Post updated successfully!")
        },
        onError: (e) => {
            const message = e.response.data.error
            toast.error(message)
        }
    })

    const { data: comments, isLoading } = useQuery<IndexPostResponse>({
        queryKey: ["comments", id],
        queryFn: async () => {
            const res = await api.get(`/api/post/${id}?per_page=10`)
            return res.data
        },
        enabled: commentOpen,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
    
    const onEditPost: SubmitHandler<EditPostFormValues> = (data) => {
        const payload = {
            text: data.text
        }

        updatePost(payload)
    }
    
    const handleCancelEdit = () => {
        methods.reset({ text })
        setIsEditing(false)
    }

    return (
        <div className="flex flex-col gap-3 mb-4">
            <Card key={id}>
                <CardHeader>
                    <Link 
                        href={`/profile/${user.username}`}
                        className="flex items-center gap-3 max-w-max"
                    >
                        <UserAvatar 
                            image_url={user.image_url}
                            username={user.username}
                        />

                        <div className="flex flex-col">
                            <h2 className="font-semibold line-clamp-1">{user.name}</h2>
                            <p>{user.username}</p>
                        </div>
                    </Link>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {isEditing ? (
                        <Form {...methods}>
                            <form onSubmit={handleSubmit(onEditPost)} className="w-full space-y-4">
                                <Textarea
                                    id="text"
                                    placeholder="Edit your post..."
                                    validation={{
                                        required: "Post content is required",
                                        maxLength: {
                                            value: 500,
                                            message: "Post must be at most 500 characters long",
                                        },
                                    }}
                                />
                                <div className="flex gap-2">
                                    <Button 
                                        type="submit" 
                                        size="sm"
                                        isLoading={isUpdating}
                                    >
                                        <Check className="w-4 h-4 mr-1" />
                                        Save
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={handleCancelEdit}
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    ) : (
                        <p>
                            {text.split('\n').map((line, i) => (
                                <Fragment key={i}>
                                {line}
                                {i < text.split('\n').length - 1 && <br />}
                                </Fragment>
                            ))}
                        </p>
                    )}
                </CardContent>

                <CardFooter>
                    <div className="flex gap-2 flex-wrap">
                        <Button 
                            variant="outline"
                            onClick={() => likePost(id)}
                            isLoading={isLiking}
                        >
                            <Heart />
                            {total_likes}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => setCommentOpen(!commentOpen)}
                        >
                            <MessageCircle />
                        </Button>

                        {isMine && (
                            <>
                                {!isEditing && (
                                    <Button 
                                        variant="outline"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                    </Button>
                                )}
                                <Button 
                                    onClick={() => deletePost(id)}
                                    variant="destructive"
                                >
                                    <Trash />
                                </Button>
                            </>
                        )}
                    </div>
                </CardFooter>
            </Card>

            {/* ===== Comment input and comments section ====== */}  
            {commentOpen && (
                <div className="flex flex-col gap-2 mb-4">
                    <CommentInput 
                        id={id}
                    />
                    <p className="font-semibold mt-4 mb-1">Comments</p>

                    {isLoading && (
                        <Skeleton className="h-10 w-full rounded-md" />
                    )}

                    {comments?.data.replies.map((rep) => (
                        <Comments 
                            parent_id={parent_id}
                            key={rep.id}
                            {...rep}
                            user={{
                                ...rep.user,
                                image_url: rep.user.image_url ?? ""
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}