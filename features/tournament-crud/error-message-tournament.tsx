import { TournamentUpdateErrors } from "@/server/mutations/tournaments.mutations";
import { X } from "lucide-react";
import React from "react";

// helper function
const getErrorMessage = (field: string, msg: string) => {
    if (field === 'name') return 'Tournament name should be longer than 3 characters';
    if (field === 'slug' && msg === 'Too small: expected string to have >=3 characters') return 'Slug name should be longer than 3 characters';
    if (field === 'location') return 'Address should be longer than 3 characters';
    return msg;
};

export function ErrorMessageForTournament({ field, fieldErrors }: {
    field: keyof TournamentUpdateErrors;
    fieldErrors: TournamentUpdateErrors;
}) {
    const errors = fieldErrors[field];

    if (!errors?.length) return null;

    return (
        <div className="text-errors text-sm sm:text-base mt-1 flex font-jersey-25">
            <div className="flex flex-col place-content-center">
                {errors.map((msg, i) => (
                    <p key={i} className="flex">
                        <X size={18} className="shrink-0 place-self-center"/>
                        {getErrorMessage(field, msg)}
                    </p>
                ))}
            </div>
        </div>
    );
}