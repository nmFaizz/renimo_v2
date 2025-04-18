export type ApiResponse<T> = {
    message: string;
    data: T;
};

export type ApiError = {
    status: boolean;
    message: string;
    error: string;
}

export type ApiErrorResponse = {
    message: string;
    response: {
        data: ApiError;
    };
    status: number;
}