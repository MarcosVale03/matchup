'use client'

import {FetchEventsFromTournamentIdResponse} from "@/server/queries/events.queries";
import {ChangeEvent, MouseEventHandler, useState} from "react";
import {useRouter} from "next/navigation";
import {FetchSeedsResponse} from "@/server/queries/seeding.queries";
import {DragDropContext, Draggable, Droppable, OnDragEndResponder} from "@hello-pangea/dnd";
import {updateSeeding} from "@/server/mutations/seeding.mutations";

export default function SeedEditor({tournamentId, events, currEventId, phaseGroupsInit}:
{
    tournamentId: number,
    events: FetchEventsFromTournamentIdResponse,
    currEventId: number,
    phaseGroupsInit: FetchSeedsResponse,
}) {
    const { replace } = useRouter()
    const [phaseGroups, setPhaseGroups] = useState<FetchSeedsResponse>(phaseGroupsInit)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleEventChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const eid = Number(e.target.value)
        replace(`/admin/tournaments/${tournamentId}/seeding/${eid}`);
    }

    const onDragEnd: OnDragEndResponder = result => {
        const {source, destination} = result;

        if (!destination) {
            return;
        }

        if (source.droppableId == destination.droppableId && source.index == destination.index) {
            return;
        }

        // Remove source seed
        const newState = Array.from(phaseGroups)
        const sourcePGIndex = newState.findIndex(({identifier}) => identifier === source.droppableId);
        if (sourcePGIndex < 0) {
            return
        }
        // Copy seed before removing
        const draggable = newState[sourcePGIndex].seeds[source.index];
        newState[sourcePGIndex].seeds.splice(source.index, 1)

        // Reinput destination seed
        const destinationPGIndex = newState.findIndex(({identifier}) => identifier === destination.droppableId);
        if (destinationPGIndex < 0) {
            return
        }
        newState[destinationPGIndex].seeds.splice(destination.index, 0, draggable)

        setPhaseGroups(newState)
    }

    const handleSubmit: MouseEventHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await updateSeeding(tournamentId, currEventId, phaseGroups);


        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            {/*HEADING*/}
            <div className='flex space-x-2 items-center m-4'>
                <h2>Seeding</h2>
                <select defaultValue={currEventId} onChange={handleEventChange} className="text-blue-600">
                    {events.map(event => (
                        <option key={event.id} value={event.id}>{event.name}</option>
                    ))}
                </select>
                <button
                    disabled={isSubmitting}
                    className="w-32 flex items-center justify-center gap-2 py-2.5 px-4
                                   rounded-md shadow-sm text-base md:text-lg lg:text-xl font-jersey-25
                                   text-white bg-primary hover:bg-secondary disabled:opacity-50
                                   transition-colors"
                    onClick={handleSubmit}>Submit</button>
            </div>
            {/*POOLS*/}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-col gap-8 my-4">
                    {phaseGroups.map(pg => (
                        <div key={pg.identifier} className="flex flex-col gap-2">
                            <h3 className='font-jersey-25 text-base sm:text-3xl'>Pool {pg.identifier}</h3>
                            <Droppable droppableId={pg.identifier}>
                                {(provided) => (
                                    <div className="flex flex-col gap-2.5" {...provided.droppableProps} ref={provided.innerRef}>
                                        {pg.seeds.map((seed, index) => (
                                            <Draggable key={index} draggableId={index.toString()} index={index}>
                                                {(provided) => (
                                                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}
                                                        className="flex items-center justify-start w-72 space-x-3 px-5 py-4
                                                   bg-gray-50 border border-gray-100 rounded-xl shadow-sm"
                                                    >
                                                        <div className="border-r pr-3">{index + 1}</div>
                                                        <div>
                                                            {seed.user?.prefix && <span className="mr-1 text-xs">{seed.user.prefix}</span>}
                                                            <span>{seed.user?.display_name || 'No Entrant'}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}