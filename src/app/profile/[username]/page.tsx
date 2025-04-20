import UserProfileContainer from "@/app/profile/[username]/containers/UserProfileContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "User Profile",
    description: "User Profile",
}

export default async function UserProfilePage({ 
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params

    return (
        <UserProfileContainer username={username} />
    )
}