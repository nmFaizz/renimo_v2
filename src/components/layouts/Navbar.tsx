"use client";
import Link from "next/link"
import Image from "next/image"

import { 
    Bell, 
    Home, 
    MessagesSquare, 
    Settings, 
    User, 
    Plus 
} from "lucide-react"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/buttons/Button"
import { useUserStore } from "@/stores/useUserStore"

export default function Navbar() {
    const { user } = useUserStore()

    const username = user?.username || "Guest"

    return (
        <header className="sticky top-0 bg-popover py-5 z-50">
            <div className="flex justify-between items-center centered-container-xl">
                <div className="flex items-center gap-4">
                    <Link href={`/profile/${username}`} className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage 
                                src={"https://github.com/shadcn.png"}
                            />
                        </Avatar>
                        <p>{user?.username}</p>
                    </Link>
                    <Button>
                        <Plus />
                        Create Post
                    </Button>
                </div>

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
            </div>
        </header>
    )
}