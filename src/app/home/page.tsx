"use client"
import withAuth from "@/components/hoc/withAuth";
import ButtonLink from "@/components/ui/links/ButtonLink";
import { useUserStore } from "@/stores/useUserStore";

function HomePage() {
    const { user, logout } = useUserStore()

    return (
        <>
            <p>Home</p>
            <p>{user?.username}</p>
            <p>{user?.bio}</p>
            <ButtonLink href="/sign-in" onClick={logout}>
                Logout
            </ButtonLink>
        </>
    )
}

export default withAuth(HomePage);