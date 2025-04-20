import { Edit } from "lucide-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "@/components/ui/buttons/Button"
import { Input } from "@/components/ui/input"
import { Form } from "@/components/ui/form"
import FileUpload from "@/components/ui/forms/FileUpload"
import { UserData } from "@/types/user"
import api from "@/lib/api"
import { ApiErrorResponse } from "@/types/api"
import { useUserStore } from "@/stores/useUserStore"
import UserAvatar from "@/components/UserAvatar"

type EditProfileFormValues = {
    name: string,
    bio: string,
    image_url: FileList | null,
}

type EditProfileProps = UserData

export default function EditProfile({
    name,
    username,
    image_url,
    bio,
}: EditProfileProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(image_url || null);
    const { user, setUser } = useUserStore()
    
    const methods = useForm<EditProfileFormValues>({
        mode: "onTouched",
        defaultValues: {
            name: name || "",
            bio: bio || "",
            image_url: null
        }
    })
    const { handleSubmit } = methods
    const queryClient = useQueryClient()

    const handleFileChange = (file: File | null) => {
        console.log(file)

        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            
            return () => URL.revokeObjectURL(url);
        }
    };

    const { mutate: updateProfile, isPending } = useMutation<void, ApiErrorResponse, FormData>({
        mutationFn: async (formData: FormData) => {
            await api.patch(`/api/user/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        },
        onSuccess: () => {
            if (user) {
                setUser({
                    ...user,
                    name: methods.getValues("name"),
                    bio: methods.getValues("bio"),
                    image_url: previewUrl || user.image_url,
                });
            } 
            queryClient.invalidateQueries({ queryKey: ["user", username] })
            toast.success("Profile updated successfully!")
        },
        onError: (e) => {
            const message = e.response.data.error
            toast.error(message);
        }
    })

    const onEditProfile: SubmitHandler<EditProfileFormValues> = (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("bio", data.bio);
        
        if (data.image_url && data.image_url.length > 0) {
            formData.append("image", data.image_url[0]);
        }

        updateProfile(formData);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    className="mt-8"
                >
                    <Edit />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <Form {...methods}>
                    <form
                        onSubmit={handleSubmit(onEditProfile)}
                        className="w-full"
                    >
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-4">
                            <div className="space-y-2">
                                {previewUrl && (
                                    <div className="mt-2 w-full flex flex-col items-center">
                                        <UserAvatar 
                                            image_url={previewUrl} 
                                            username={username} 
                                            isStatic={false}
                                            size="xl"
                                        />
                                    </div>
                                )}
                                <FileUpload 
                                    id="image_url"
                                    label="Profile picture"
                                    accept="image/*"
                                    onFileChange={handleFileChange}
                                    helperText="Upload a profile picture (max 5MB)"
                                    validation={{
                                        validate: {
                                            fileType: (value) => {
                                                if (!value || !value.length) return true;
                                                const file = value[0];
                                                return file.type.startsWith('image/') || 'File must be an image';
                                            },
                                            fileSize: (value) => {
                                                if (!value || !value.length) return true;
                                                const file = value[0];
                                                return file.size <= 5 * 1024 * 1024 || 'File size must be less than 5MB';
                                            }
                                        }
                                    }}
                                />
                            </div>

                            <Input
                                id="name"
                                label="Name"
                                placeholder="Enter new name"
                                validation={{
                                    required: "Name is required",
                                    minLength: {
                                        value: 3,
                                        message: "Name must be at least 3 characters long",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: "Name must be at most 50 characters long",
                                    },
                                }}
                            />

                            <Input
                                id="bio"
                                label="Bio"
                                placeholder="Enter new bio"
                                validation={{
                                    maxLength: {
                                        value: 160,
                                        message: "Bio must be at most 160 characters long",
                                    },
                                }}
                            />
                        </div>
                        <DialogFooter>
                            <Button 
                                type="submit"
                                isLoading={isPending}
                            >
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}