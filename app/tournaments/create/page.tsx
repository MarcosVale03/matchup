import TournamentInsertForm from '@/features/tournament-crud/create-tournament';
import { BackButton } from '@/ui/back-button';

export default function CreateTournamentPage() {
    return (
        <div className="bg-white">
            <div className="flex place-content-center relative">
                {/* <BackButton buttonClass='flex text-primary font-sans' text='Back' /> */}
                <TournamentInsertForm />
            </div>
        </div>
    );
}