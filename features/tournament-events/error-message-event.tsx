import { EventInsertErrors } from '@/server/mutations/events.mutations';
import { X } from 'lucide-react';
import React from 'react';

const getErrorMessage = (field: string, msg: string) => {
    if (field === 'name') return 'Event name should be between 3 and 80 characters';
    if (field === 'price') return 'Entry fee must be a non-negative number';
    if (field === 'max_team_size') return 'Max team size is required when teams are allowed';
    if (field === 'game_and_platform') return 'Invalid video game and platform combination';
    if (field === 'times') return 'Start time must be before end time';
    return msg;
};

export function ErrorMessageForEvent({
    field,
    fieldErrors,
}: {
    field: keyof EventInsertErrors;
    fieldErrors: EventInsertErrors;
}) {
    const errors = fieldErrors[field];

    if (!errors?.length) return null;

    return (
        <div className="text-errors text-sm sm:text-base mt-1 flex font-jersey">
            <div className="flex flex-col place-content-center">
                {errors.map((msg, i) => (
                    <p key={i} className="flex">
                        <X size={18} className="shrink-0 place-self-center" />
                        {getErrorMessage(field, msg)}
                    </p>
                ))}
            </div>
        </div>
    );
}
