"use client";
import { useQuery } from "@tanstack/react-query";

import MainLayout from "@/components/layouts/MainLayout";
import api from "@/lib/api";
import { UserData } from "@/types/user";
import { ApiResponse } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import ButtonLink from "@/components/ui/links/ButtonLink";
import { useUserStore } from "@/stores/useUserStore";
import EditProfile from "@/app/profile/[username]/components/EditProfile";
import UserAvatar from "@/components/UserAvatar";
import withAuth from "@/components/hoc/withAuth";
import { PostResponse } from "@/lib/post";
import PostCard from "@/components/post/PostCard";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

function UserProfileContainer({
    username
}: Readonly<{
    username: string;
}>) {
    const { user, logout } = useUserStore()

    const { data: userQuery, isLoading } = useQuery<ApiResponse<UserData>>({
        queryKey: ["user", username],
        queryFn: async () => {
            const res = await api.get(`/api/user/${username}`)
            return res.data
        },
        refetchOnWindowFocus: false,
    })

    const { data: posts, isLoading: postsLoading } = useQuery<PostResponse>({
        queryKey: ["posts", username],
        queryFn: async () => {
            const res = await api.get(`/api/user/${username}/posts?per_page=100`)
            return res.data
        }, 
        refetchOnWindowFocus: false,
    })

    const usernameQuery = userQuery?.data.username

    return (
        <MainLayout>
            {isLoading && (
                <Skeleton className="h-[150px] rounded-xl w-full mb-4" />
            )}

            {userQuery && (
                <div className="flex flex-col items-center">
                    <UserAvatar 
                        image_url={userQuery.data.image_url}
                        username={userQuery.data.username}
                        size="xl"
                    />

                    <h2 className="mt-5 text-xl font-bold text-center">
                        {userQuery.data.name}
                    </h2>

                    <p className="text-center">
                        {userQuery.data.username}
                    </p>

                    <p className="mt-5 text-center">
                        {userQuery.data.bio}
                    </p>

                    {user?.username === usernameQuery && (
                        <>
                            <EditProfile 
                                {...userQuery.data}
                            />
                            <ButtonLink 
                                href="/sign-in" 
                                onClick={logout} 
                                className="mt-4"
                                variant="destructive"
                            >
                                Logout
                            </ButtonLink>
                        </>
                    )}
                </div>
            )}

            <Tabs defaultValue="posts" className="mt-10 w-full">
                <TabsList>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="liked">Liked</TabsTrigger>
                </TabsList>
                <TabsContent value="posts">
                    <div className="mt-10">
                        <h2 className="text-xl font-bold mb-4">Posts</h2>

                        {postsLoading && (
                            [...Array(5)].map((_, index) => (
                                <Skeleton key={index} className="h-[150px] rounded-xl w-full mb-4" />
                            ))
                        )}

                        {posts?.data?.map((post) => (
                            !post.is_deleted && post.user.username === usernameQuery && (
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
                </TabsContent>
                <TabsContent value="liked">
                    <UserLikedPostsContainer username={usernameQuery} />
                </TabsContent>
            </Tabs>

            
        </MainLayout>
    )
}

function UserLikedPostsContainer({
    username,
}: {
    username?: string;
}) {
    const { user } = useUserStore()

    const { data: posts, isLoading } = useQuery<PostResponse>({
        queryKey: ["posts", username],
        queryFn: async () => {
            const res = await api.get(`/api/user/${username}/posts?per_page=100&is_liked=true`)
            return res.data
        }, 
        refetchOnWindowFocus: false,
    })

    return (
        <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Liked Posts</h2>

            {isLoading && (
                [...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-[150px] rounded-xl w-full mb-4" />
                ))
            )}

            {posts?.data?.map((post) => (
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

            {posts?.data?.length === 0 && (
                <p className="text-center text-gray-500">No liked posts found.</p>
            )}
        </div>
    )
}
 
export default withAuth(UserProfileContainer)