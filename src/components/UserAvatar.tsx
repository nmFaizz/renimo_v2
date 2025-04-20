import { 
    Avatar ,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserProfileProps = {
    image_url?: string | null,
    username: string,
    imageClassname?: string,
    size?: "normal" | "xl",
    isStatic?: boolean,
}

export default function UserAvatar({
    image_url,
    username,
    size = "normal",
    isStatic = true,
    imageClassname,
}: UserProfileProps) {
    const imageUrl = `https://tugas2-fe.labse.id/assets/${image_url}`

    return (
        <Avatar className={cn(
            imageClassname,
            size === "xl" && "w-[100px] h-[100px]",
        )}>
            <AvatarImage 
                src={isStatic ? imageUrl : image_url!}
                alt="User profile picture"
            />
            <AvatarFallback>
                <p className={cn(
                    size === "xl" && "text-4xl",
                    "text-center"
                )}>
                    {username?.charAt(0).toUpperCase()}
                </p>
            </AvatarFallback>
        </Avatar>
    )
}   