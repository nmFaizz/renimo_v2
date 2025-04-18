export type ApiResponse<T> = {
    message: string;
    data: T;
};

export type ApiErrorResponse = {
    status: boolean;
    message: string;
    error: string;
}