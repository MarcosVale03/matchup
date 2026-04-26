'use client'
import { act, useState } from 'react';
import { createSetupsFromInput } from '@/server/mutations/match-setups.mutations';
import {useRouter} from 'next/navigation'
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { assignMatchToSetup } from '@/server/mutations/match-setups.mutations';
import { freeUpSetup } from '@/server/mutations/match-setups.mutations';

function Draggable({match} : {match : any}) {
        const {attributes, listeners, setNodeRef, transform} = useDraggable({
            id : match.id,
            data : {id : match.id, phase_group_identifier : match.phase_group_identifier}
        })
        const style = transform? {transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,} : undefined;

        return (
            <div suppressHydrationWarning key={match.id} ref={setNodeRef} style={style} {...listeners} {...attributes} className='peer block bg-white w-full rounded-xl border-2 border-white 
                text-black p-2 2xl:p-4 2xl:text-xl focus:outline-none 
                focus:border-primary shadow-sm cursor-grab font-normal'>
                <p className='text-sm'>{match.code} - {match.phase_group_identifier}- Round {match.round_num}</p>
                <p className='font-semibold'>{match.match_slots?.[0]?.seeds?.users?.display_name} vs {match.match_slots?.[1]?.seeds?.users?.display_name}</p>
            </div>
        )
    }

function Droppable({id} : {id : string, match?: any}) {
    const {isOver, setNodeRef} = useDroppable({
        id: id,
        data : {identifier : id}
    });

    const style = {
        color: isOver ? 'green' : undefined,
    };  

    return (
        <div ref={setNodeRef} className='flex items-center justify-center border-1 border-dashed border-gray-500 py-3 px-3 mt-2 mb-3' style={style}>
            DROP MATCH HERE
        </div>
    );
}

export default function AssignMatchesForm({matches, stations, tournament_id, event_id}: {matches: any[], stations : any[], tournament_id: number, event_id : number}) {console.log(matches[0])
    const pageLabelClass = "block text-zinc-600 2xl:text-xl rounded-md peer-focus:text-primary transition duration-400";
    const [station, setStation] = useState(1)
    const router = useRouter()

    const handleSetupRelease = async (identifier : string) => {
        await freeUpSetup(identifier , tournament_id, event_id)
        router.refresh()
    }

    const handleStationGenerate = async () => {
        await createSetupsFromInput(tournament_id, event_id, station)
        router.refresh()
    }

    async function handleDragEnd(event : DragEndEvent) {
        const {active, over} = event;
        if (over && active.data.current && over.data.current) {
            await assignMatchToSetup(String(over.id), tournament_id, event_id, active.data.current.phase_group_identifier, active.data.current.id)
            router.refresh()
        }
    }

    return (    
        <>
            {/* Top Section */}
            <div className="mt-4 mx-4 sm:mx-auto w-full max-w-[calc(100%-2rem)] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl 2xl:max-w-7xl">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-jersey-25">
                    Assign Matches to Setups
                </h1>
                <h2 className="text-base mb-4 pb-1 text-gray-600 border-b border-gray-300">
                    Drag matches to a station to assign them to a location.
                </h2>
                {/* Generate Stations */}
                <div className='mb-5'>
                    <span className={pageLabelClass}>Generate Stations</span>
                    <div className='flex gap-2 mt-3'>
                        <input className='peer block bg-white rounded-xl border-2 border-white
                        text-black p- 2xl:p-4 2xl:text-xl focus:outline-none focus:border-primary 
                        shadow-sm transition duration-400 font-normal' type="number"min="1" max="30"
                        value={station} onChange={(e) => setStation(Number(e.target.value))}/>
                        <button className='py-2 px-3 bg-primary rounded text-white hover:border-red-50 hover:bg-red-500 transition-colors' onClick={handleStationGenerate}>Submit</button>
                    </div>
                </div>
                {/* Columns */}
                <DndContext onDragEnd={handleDragEnd}>
                    <div className="space-y-4 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Matches */}
                            <div className="mb-2 rounded-xl">
                                <span className={pageLabelClass}>Matches</span>
                                <div className='flex flex-col mt-3 gap-2'>
                                    {matches.map((match) => (
                                        <Draggable key={match.id} match={match}/>
                                    ))}
                                </div>
                            </div> 
                            {/* Stations */}
                            <div className="mb-2 rounded-xl">
                            <span className={pageLabelClass}>Stations</span>
                                <div className='flex flex-col mt-3 gap-2'>
                                    {stations.map((station) => (
                                        <div key={station.identifier} className='peer block bg-white w-full rounded-xl border-2 border-white 
                                            text-black p-2 2xl:p-4 2xl:text-xl focus:outline-none 
                                            focus:border-primary shadow-sm transition duration-400 font-normal'>
                                            <div className='flex justify-between items-start'>
                                                <p>{station.identifier}</p>
                                                <button  onClick={() => handleSetupRelease(station.identifier)} className='px-2 py-0.5 text-sm rounded-md border border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-colors'>Release</button>
                                            </div>
                                            <Droppable id={station.identifier}/>
                                            {/* Winner */}
                                            <div className='flex gap-2'>
                                                <button className='w-full text-sm rounded border rounded-md hover:border-red-50 hover:bg-red-400 transition-colors'>
                                                    Player 1 Wins
                                                </button>
                                                <button className='w-full text-sm rounded border rounded-md hover:border-red-50 hover:bg-red-400 transition-colors'>
                                                    Player 2 Wins
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div> 
                        </div> 
                    </div>
                </DndContext>   
            </div>
        </>           
    )
}