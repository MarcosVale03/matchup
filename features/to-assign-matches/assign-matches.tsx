'use client'
import BasicInputWithLabel from '@/ui/basic-input-with-label';

export default function AssignMatchesForm({ matches }: { matches: any[] }) {
    
    const pageLabelClass = "block text-zinc-600 2xl:text-xl rounded-md peer-focus:text-primary transition duration-400";
    const matchess = [
        { id: 1, player1: 'test', player2: 'test2', round: 1, code: 'R1M1' },
        { id: 2, player1: 'player3', player2: 'player4', round: 1, code: 'R1M2' },
        { id: 3, player1: 'player5', player2: 'player6', round: 2, code: 'R2M1' },
    ]

    const stations = [1, 2, 3]
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
                        shadow-sm transition duration-400 font-normal' type="number"min="1" max="30"/>
                        <button className='py-2 px-3 bg-primary rounded text-white'>Submit</button>
                    </div>
                </div>
                {/* Columns */}
                <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Matches */}
                        <div className="mb-2 rounded-xl">
                            <span className={pageLabelClass}>Matches</span>
                            <div className='flex flex-col mt-3 gap-2'>
                                {/* {matchess.map((match) => ( */}
                                    <div className='peer block bg-white w-full rounded-xl border-2 border-white 
                            text-black p-2 2xl:p-4 2xl:text-xl focus:outline-none 
                            focus:border-primary shadow-sm transition duration-400 font-normal'>
                                    <p>player1 vs player2</p>
                                
                                </div>
                                {/* ))} */}
                                
                            </div>
                        </div> 
                        {/* Stations */}
                        <div className="mb-2 rounded-xl">
                           <span className={pageLabelClass}>Stations</span>
                            <div className='flex flex-col mt-3 gap-2'>
                                {/* {stations.map((station) => ( */}
                                    <div className='peer block bg-white w-full rounded-xl border-2 border-white 
                                        text-black p-2 2xl:p-4 2xl:text-xl focus:outline-none 
                                        focus:border-primary shadow-sm transition duration-400 font-normal'>
                                        <p>Station {1}</p>
                                        {/* Winner */}
                                        <div className='flex gap-2'>
                                            <button className=''>
                                                Player 1 Wins
                                            </button>
                                            <button className=''>
                                                Player 2 Wins
                                            </button>
                                        </div>
                                    </div>
                                    
                                {/* ))} */}
                            </div>
                        </div> 
                    </div> 
                </div>
            </div>

        </>           
    )
}