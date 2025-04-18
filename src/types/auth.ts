import { UserData } from "@/types/user";

export type SignInResponse = {
    status: boolean;
    message: string;
    data: {
        token: string;
    }
}

export type SignUpResponse = {
    status: boolean;
    message: string;
    data: UserData;
}

export type CheckUsernameResponse = {
    status: boolean;
    message: string;
    data: {
        isAvailable: boolean;
    }
}
