"use client"
import { useQuery } from "@tanstack/react-query";

import withAuth from "@/components/hoc/withAuth";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/api";
import { PostResponse } from "@/lib/post";
import MainLayout from "@/components/layouts/MainLayout";

import CreatePost from "@/components/post/CreatePost";
import { useUserStore } from "@/stores/useUserStore";
import PostCard from "@/components/post/PostCard";

function HomePage() {
    const { user } = useUserStore()

    const { data, isLoading } = useQuery<PostResponse>({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await api.get("/api/post?per_page=100")
            return res.data
        }, 
        refetchOnWindowFocus: false,
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
                    
                {data?.data?.map((post) => (
                    !post.is_deleted && (
                        <PostCard 
                            key={post.id}
                            {...post}
                            user={{
                                username: post.user.username,
                                image_url: post.user.image_url,
                                name: post.user.name,
                            }}
                            isMine={user?.username === post.user.username}
                        />
                    )
                ))}
            </div>
        </MainLayout>
    )
}

export default withAuth(HomePage);