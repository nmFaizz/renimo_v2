"use client"
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ButtonLink from "@/components/ui/links/ButtonLink";
import { Input } from "@/components/ui/input";
import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader, 
    CardTitle
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/buttons/Button";
import api from "@/lib/api";
import { CheckUsernameResponse, SignUpResponse } from "@/types/auth";
import { ApiError, ApiErrorResponse } from "@/types/api";

type SignUpFormValues = {
    name: string;
    username: string;
    password: string;
}

export default function SignUpPage() {
    const methods = useForm({
        mode: "onTouched",
        defaultValues: {
            name: "",
            username: "",
            password: ""
        }
    });

    const { handleSubmit } = methods;
    const router = useRouter();

    const { mutate: checkUsername, isPending: isCheckingUsername } = useMutation<
        CheckUsernameResponse, 
        ApiErrorResponse, 
        string
    >({
        mutationFn: async (username) => {
            const res = await api.post("/api/user/check-username", { username });
            return res.data;
        }
    });

    const { mutate: registerUser, isPending: isRegistering } = useMutation<
        SignUpResponse, 
        ApiErrorResponse, 
        SignUpFormValues
    >({
        mutationFn: async (data) => {
            const res = await api.post("/api/user/register", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Account created successfully");
            router.push("/sign-in");
        },
        onError: (res) => {
            const message = res.response.data.error
            toast.error(message);
        }
    });

    const handleSignUp: SubmitHandler<SignUpFormValues> = (data) => {
        checkUsername(data.username, {
            onSuccess: () => {
                registerUser(data);
                router.push("/sign-in");
            },
            onError: (res) => {
                const message = res.response.data.error
                toast.error(message);
            }
        });
    };

    const isLoading = isCheckingUsername || isRegistering;

    return (
        <main className="flex flex-col items-center justify-center min-h-screen py-2 px-4">
            <Form {...methods}>
                <form className="max-w-[520px] w-full" onSubmit={handleSubmit(handleSignUp)}>
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
                                Sign Up
                            </CardTitle>
                            <CardDescription>
                                Sign Up to create account.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <Input
                                        id="name"
                                        label="Name"
                                        placeholder="Enter Name"
                                        validation={{
                                            required: "Name is required",
                                            minLength: {
                                                value: 3,
                                                message: "Name must be at least 3 characters long"
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: "Name must be at most 20 characters long"
                                            },
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Input
                                        id="username"
                                        label="Username"
                                        placeholder="Enter username"
                                        validation={{
                                            required: "Username is required",
                                            minLength: {
                                                value: 3,
                                                message: "Username must be at least 3 characters long"
                                            },
                                            maxLength: {
                                                value: 20,
                                                message: "Username must be at most 20 characters long"
                                            },
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Input
                                        id="password"
                                        type="password"
                                        label="Password"
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
                            <div className="w-full flex flex-col gap-4">
                                <Button type="submit" isLoading={isLoading}>
                                    SignUp
                                </Button>
                                <div className="flex items-center gap-2">
                                    <p>
                                        Already have an account?
                                    </p>
                                    <ButtonLink 
                                        href="/sign-in" 
                                        variant="link"
                                        className="p-0 text-info"
                                    >
                                        Sign In
                                    </ButtonLink>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </main>
    )
}