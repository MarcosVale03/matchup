import NavigationBar from '@/ui/navigation-bar'; // Adjust path as needed
import TournamentInsertForm from '@/features/tournament-creation/page';
import { BackButton } from '@/ui/back-button';

export default function CreateTournamentPage() {
    return (
        <div className="bg-white">
            <NavigationBar hiddenButton={false} />
            <div className="flex place-content-center relative">
                {/* <BackButton buttonClass='flex text-[#BD2D2D] font-sans' text='Back' /> */}
                <TournamentInsertForm />
            </div>
        </div>
    );
}