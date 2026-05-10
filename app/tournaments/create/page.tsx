import TournamentInsertForm from '@/features/tournament-crud/create-tournament';

export default async function CreateTournamentPage() {
    return (
        <div className="bg-main-bg flex-1 flex flex-col text-black font-poppins">
            <TournamentInsertForm />
        </div>
    );
}