import NavigationBar from '@/ui/navigation-bar'; // Adjust path as needed
import TournamentInsertForm from '@/features/tournament-creation/page';

export default function CreateTournamentPage() {
    return (
        <>
            <NavigationBar hidden={false} />
            <div className="min-h-screen bg-white flex justify-center items-center">
                <TournamentInsertForm />
            </div>
        </>
    );
}