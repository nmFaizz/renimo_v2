"use client";
import Link from "next/link"
import Image from "next/image"

import { useUserStore } from "@/stores/useUserStore"
import UserAvatar from "@/components/UserAvatar";

export default function Navbar() {
    const { user } = useUserStore()

    const username = user?.username || "Guest"

    return (
        <header className="sticky top-0 bg-popover py-5 z-50">
            <div className="flex items-center gap-5 centered-container-xl">
                <Link href="/home">
                    <figure>
                        <Image 
                            src="/images/logo.png" 
                            alt="Logo" 
                            width={50} 
                            height={50} 
                        />
                    </figure>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href={`/profile/${username}`} className="flex items-center gap-4">
                        <UserAvatar 
                            image_url={user?.image_url}
                            username={user?.username || "Guest"}
                        />
                        <p>{user?.username}</p>
                    </Link>
                </div>
            </div>
        </header>
    )
}