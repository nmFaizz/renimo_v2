import { Button } from "@/components/ui/buttons/Button"
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { Heart } from "lucide-react";
import { ApiErrorResponse } from "@/types/api";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CommentProps = {
    id: number;
    parent_id?: number | null;
    user: {
        username: string;
        name: string;
        image_url: string;
    };
    text: string;
    total_likes: number;
}

export default function Comments({
    id,
    user,
    text,
    parent_id,
    total_likes,
}: CommentProps) {
    const queryClient = useQueryClient()

    const { mutate: likeComment, isPending: isCommenting } = useMutation<
        void, 
        ApiErrorResponse, 
        number
    >({
        mutationFn: async (commentId: number) => {
            await api.put(`/api/likes/${commentId}`)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", parent_id] })
            toast.success("Post liked successfully!")
        },
        onError: (e) => {
            const message = e.response.data.error
            toast.error(message);
        }
    })

    return (
        <div key={id} className="flex flex-col gap-2 mb-5">
            <div>
                <Link 
                    href={`/profile/${user.username}`}
                    className="flex items-center gap-2 w-max"
                >
                    <UserAvatar 
                        image_url={user.image_url}
                        username={user.username}
                    />
                    <div className="flex flex-col">
                        <h2 className="font-semibold line-clamp-1 !text-wrap">{user.name}</h2>
                        <p>{user.username}</p>
                    </div>
                </Link>
            </div>

            <p className="mt-2">{text}</p>

            <Button
                variant="outline"
                className="w-max mt-2"
                onClick={() => likeComment(id)}
                isLoading={isCommenting}
            >
                <Heart />
                {total_likes}
            </Button>
        </div>
    )
}