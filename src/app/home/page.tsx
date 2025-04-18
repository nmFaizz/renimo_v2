"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import withAuth from "@/components/hoc/withAuth";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { PostResponse } from "@/lib/post";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import MainLayout from "@/components/layouts/MainLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/buttons/Button";
import CreatePost from "@/components/post/CreatePost";
import Link from "next/link";
import { useUserStore } from "@/stores/useUserStore";
import { ApiErrorResponse } from "@/types/api";
import { toast } from "sonner";

function HomePage() {
    const { user } = useUserStore()
    const queryClient = useQueryClient()

    const { data, isLoading } = useQuery<PostResponse>({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await api.get("/api/post")
            return res.data
        }, 
        refetchOnWindowFocus: false,
    })

    const { mutate } = useMutation<
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

    return (
        <MainLayout>
            <CreatePost />

            <div className="mt-16">
                {isLoading && (
                    [...Array(5)].map((_, index) => (
                        <Skeleton key={index} className="h-[150px] rounded-xl w-full mb-4" />
                    ))
                )}
                    
                {data?.data.map((post) => (
                    !post.is_deleted && (
                        <Card key={post.id} className="mb-4">
                            <CardHeader>
                                <Link 
                                    href={`/profile/${post.user.username}`}
                                    className="flex items-center gap-2"
                                >
                                    <Avatar>
                                        <AvatarImage 
                                            src={post.user.image_url!}
                                            alt="User profile picture"
                                        />
                                        <AvatarFallback>
                                            {post.user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <h2>{post.user.username}</h2>
                                </Link>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <p>{post.text}</p>
                            </CardContent>

                            <CardFooter>
                                <div className="flex gap-3">
                                    <Button variant="outline">
                                        <Heart />
                                        {post.total_likes}
                                    </Button>

                                    {user?.username === post.user.username && (
                                        <Button 
                                            onClick={() => mutate(post.id)}
                                            variant="destructive"
                                        >
                                            <Trash />
                                        </Button>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    )
                ))}
            </div>
        </MainLayout>
    )
}

export default withAuth(HomePage);