import TournamentInsertForm from '@/features/tournament-crud/create-tournament';

export default function CreateTournamentPage() {
    return (
        <div className="bg-primary">
            <div className="flex place-content-center">
                <TournamentInsertForm />
            </div>
        </div>
    );
}