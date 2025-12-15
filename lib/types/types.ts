export type QueryResponse<T> = {
    success: boolean,
    data?: T,
    message?: string
}