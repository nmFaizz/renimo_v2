"use client"
import { useQuery } from "@tanstack/react-query"

import MainLayout from "@/components/layouts/MainLayout"
import { Skeleton } from "@/components/ui/skeleton"
import { PostResponse } from "@/lib/post"
import PostCard from "@/components/post/PostCard"
import { useUserStore } from "@/stores/useUserStore"
import api from "@/lib/api"

type SearchPageContainerProps = {
    search: string
}

export default function SearchPageContainer({
    search
}: SearchPageContainerProps) {
    const { user } = useUserStore()

    const { data: searchResults, isLoading } = useQuery<PostResponse>({
        queryKey: ["search", search],
        queryFn: async () => {
            const res = await api.get(`/api/post?per_page=100&search=${search}`)
            return res.data
        },
    })
    
    return (
        <MainLayout withMargin withNavbar>
            <div>
                <h1 className="text-2xl font-bold mb-4">Search results for "{search}"</h1>
                {isLoading && (
                    <Skeleton className="w-full h-10 mb-4" />
                )}

                {searchResults?.data?.length === 0 && (
                    <p className="text-center">No results found for "{search}"</p>
                )}

                {searchResults?.data?.map((post) => (
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