'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteTournament } from '@/server/mutations/tournaments.mutations';

interface DeleteButtonProps {
    tournamentId: number;
    tournamentName: string;
}

export default function DeleteTournamentButton({ tournamentId, tournamentName }: DeleteButtonProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        const confirmation = window.confirm(
            `Are you sure you want to permanently delete the tournament "${tournamentName}"? This action cannot be undone.`
        );

        if (confirmation) {
            setIsDeleting(true);
            setError(null);
            
            try {
                const response = await deleteTournament(tournamentId);

                if (response.success) {
                    alert(`Tournament "${tournamentName}" deleted successfully.`);
                    router.push('/tournaments'); 
                } else {
                    setError("Failed to delete the tournament. Please check server logs."); 
                }
            } catch (err) {
                console.error(err);
                setError("An unexpected error occurred during deletion.");
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="min h">
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-primary mt-3 text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:bg-secondary transition duration-150 transform hover:scale-105"
            >
                {isDeleting ? 'Deleting...' : `Delete "${tournamentName}"`}
            </button>
            {error && (
                <p className="mt-2 text-sm text-red-500">Error: {error}</p>
            )}
        </div>
    );
}