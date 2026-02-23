import { TournamentUpdateErrors } from "@/server/mutations/tournaments.mutations";
import { X } from "lucide-react";
import React from "react";

export function ErrorMessage({ field, fieldErrors }: {
    field: keyof TournamentUpdateErrors;
    fieldErrors: TournamentUpdateErrors;
}) {
    const errors = fieldErrors[field];

    if (!errors?.length) return null;

    return (
        <div className="text-red-500 text-sm mt-2 flex">
            <X size={18}/>
            {errors.map((msg, i) => (
                <p key={i}>
                    {field !== 'name' ? msg : 'Tournament name should be longer than 3 characters'}
                </p>
            ))}
        </div>
    );
}