import TournamentEventForm from '@/features/event-creation/page';

export default function CreateEventsPage() {
    return (
        <div className="bg-white">
            <div className="relative flex place-content-center">
                {/* <BackButton buttonClass='flex text-primary font-sans' text='Back' /> */}
                <TournamentEventForm />
            </div>
        </div>
    );
}