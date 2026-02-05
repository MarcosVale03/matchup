import {Database} from "@/lib/types/db.types";

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

export type Tournament = Database["public"]["Tables"]["tournaments"]["Row"]