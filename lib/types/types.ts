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

export enum BracketType {
    SingleElimination,
    DoubleElimination,
    RoundRobin
}

const BracketTypeMap: Map<string, BracketType> = new Map()
BracketTypeMap.set("Single Elimination", BracketType.SingleElimination)
BracketTypeMap.set("Double Elimination", BracketType.DoubleElimination)
BracketTypeMap.set("Round Robin", BracketType.RoundRobin)
export {BracketTypeMap};

export enum PermissionLevel {
    Owner,
    Admin,
    Moderator,
    BracketManager,
    Reporter
}