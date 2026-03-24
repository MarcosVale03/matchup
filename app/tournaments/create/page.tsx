import TournamentInsertForm from '@/features/tournament-crud/create-tournament';

export default async function CreateTournamentPage() {
    return (
        <div className="bg-main-bg flex flex-col text-black font-[Poppins] justify-center">
            <TournamentInsertForm />
        </div>
    );
}