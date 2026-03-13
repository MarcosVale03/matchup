import { TournamentUpdateErrors } from "@/server/mutations/tournaments.mutations";
import { X } from "lucide-react";
import React from "react";

export function ErrorMessageForTournament({ field, fieldErrors }: {
    field: keyof TournamentUpdateErrors;
    fieldErrors: TournamentUpdateErrors;
}) {
    const errors = fieldErrors[field];

    if (!errors?.length) return null;

    return (


        <div className="text-errors text-sm lg:text-lg mt-1 flex font-jersey-25">
            <X size={18} className="shrink-0 mt-1"/>
            {errors.map((msg, i) => (
                <p key={i}>
                    {/*{field !== 'name' ? msg : 'Tournament name should be longer than 3 characters'}*/}
                    {field === 'name' ? 'Tournament name should be longer than 3 characters'
                        : (field === 'slug' && msg === 'Too small: expected string to have >=3 characters') ? "Slug name should be longer than 3 characters"
                        : msg
                    }
                </p>
            ))}
        </div>
    );
}