import UserProfileContainer from "@/app/profile/[username]/containers/UserProfileContainer";

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