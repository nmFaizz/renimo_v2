"use client"
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ButtonLink from "@/components/ui/links/ButtonLink";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter,
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/buttons/Button";
import api from "@/lib/api";
import { setToken } from "@/lib/cookie";
import { SignInResponse } from "@/types/auth";
import { useUserStore } from "@/stores/useUserStore";
import { UserResponse } from "@/types/user";
import { ApiErrorResponse } from "@/types/api";import MainLayout from "@/components/layouts/MainLayout";
;

type SignInFormValues = {
    username: string;
    password: string;
}

export default function SignInPage() {
    const methods = useForm<SignInFormValues>({
        mode: "onTouched",
        defaultValues: {
            username: "",
            password: ""
        }
    });
    const { handleSubmit } = methods;
    
    const { setUser } = useUserStore()

    const router = useRouter()

    const { mutate: setUserData } = useMutation<UserResponse, ApiErrorResponse>({
        mutationFn: async () => {
            const res = await api.get("/api/user/me")
            return res.data
        },
        onSuccess: (res) => {
            setUser(res.data)
        },
        onError: (res) => {
            const message = res.response.data.error
            toast.error(message);
        }
    })

    const { mutate, isPending } = useMutation<SignInResponse, ApiErrorResponse, SignInFormValues>({
        mutationFn: async (data: SignInFormValues) => {
            const res = await api.post("/api/user/login", data)
            return res.data
        },
        onSuccess: (res) => {
            const token = res.data.token;
            setToken("renimo_token", token);
            setUserData();
            toast.success("Login successful")
            router.push("/home");
        },
        onError: (res) => {
            const message = res.response.data.error
            toast.error(message);
        }
    })

    const handleSignIn: SubmitHandler<SignInFormValues> = (data) => {
        mutate(data);
    }
    
    return (
        <MainLayout 
            withMargin={false}
            withNavbar={false}
            className="flex flex-col items-center justify-center min-h-screen py-2 px-4"
        >
            <Form {...methods}>
                <form onSubmit={handleSubmit(handleSignIn)} className="max-w-[520px] w-full">
                    <Card>
                        <CardHeader>
                            <figure className="w-full flex justify-center">
                                <Image 
                                    src="/images/logo.png" 
                                    alt="Logo" 
                                    width={100} 
                                    height={100} 
                                    className="mb-4"
                                />
                            </figure>
                            <CardTitle className="text-2xl font-bold"> 
                                Sign In
                            </CardTitle>
                            <CardDescription>
                                Enter your email and password to sign in.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <Input
                                        id="username"
                                        label="Username"
                                        placeholder="Enter username"
                                        validation={{
                                            required: "Username is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._-]+$/,
                                                message: "Username can only contain letters, numbers, dots, underscores, and hyphens"
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Input
                                        id="password"
                                        label="Password"
                                        type="password"
                                        placeholder="Enter password"
                                        validation={{
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters long"
                                            },
                                            maxLength: {
                                                value: 20,
                                                message: "Password must be at most 20 characters long"
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <div className="w-full">
                                <Button 
                                    type="submit"
                                    className="w-full"
                                    isLoading={isPending}
                                >
                                    Login
                                </Button>

                                <div className="flex items-center gap-2 mt-4">
                                    <p>Don't have an account? </p>
                                    <ButtonLink 
                                        href="/sign-up" 
                                        variant="link"
                                        className="p-0 text-info"
                                    >
                                        Sign Up
                                    </ButtonLink>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </MainLayout>
    )
}