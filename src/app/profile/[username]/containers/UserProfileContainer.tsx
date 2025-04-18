"use client";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";

import MainLayout from "@/components/layouts/MainLayout";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/api";
import { UserData } from "@/types/user";
import { ApiResponse } from "@/types/api";
import { Skeleton } from "@/components/ui/skeleton";
import ButtonLink from "@/components/ui/links/ButtonLink";
import { useUserStore } from "@/stores/useUserStore";

export default function UserProfileContainer({
    username
}: Readonly<{
    username: string;
}>) {
    const { user, logout } = useUserStore()

    const { data, isLoading } = useQuery<ApiResponse<UserData>>({
        queryKey: ["user", username],
        queryFn: async () => {
            const res = await api.get(`/api/user/${username}`)
            return res.data
        },
        refetchOnWindowFocus: false,
    })

    return (
        <MainLayout>
            {isLoading && (
                <Skeleton className="h-[150px] rounded-xl w-full mb-4" />
            )}

            <div className="flex flex-col items-center">
                <Avatar className="w-[100px] h-[100px]">
                    <AvatarImage 
                        src={data?.data.image_url}
                        width={100}
                        height={100}
                    />
                    <AvatarFallback className="text-4xl">
                        {data?.data.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <h2 className="mt-5 text-xl font-bold">
                    {data?.data.name}
                </h2>

                <p>
                    {data?.data.username}
                </p>

                <p className="mt-5">
                    {data?.data.bio}
                </p>

                {user?.username === data?.data.username && (
                    <>
                        <ButtonLink 
                            className="mt-8"
                            href={`/profile/${data?.data.username}/edit`}
                        >
                            <Edit />
                            Edit Profile
                        </ButtonLink>
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
        </MainLayout>
    )
}