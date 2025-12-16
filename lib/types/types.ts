export type QueryResponse<T> = {
    success: boolean,
    data?: T,
    message?: string
}

export type MutationResponse<Data, FieldErrors> = {
    success: boolean,
    formErrors?: string[],
    fieldErrors?: FieldErrors,
    data?: Data
}

export type Tournament = {
    id: number;
    name: string;
    slug: string | null;
    start_time: Date;
    end_time: Date;
    home_page: string;
    is_online?: boolean;
}