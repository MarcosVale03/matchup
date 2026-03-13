import NavigationBar from '@/ui/navigation-bar'; // Adjust path as needed
import TournamentEventForm from '@/features/event-creation/page';

export default function CreateEventsPage() {
    return (
        <div className="bg-white">
            <NavigationBar hidden={true} />
            <div className="relative flex place-content-center">
                {/* <BackButton buttonClass='flex text-primary font-sans' text='Back' /> */}
                <TournamentEventForm />
            </div>
        </div>
    );
}