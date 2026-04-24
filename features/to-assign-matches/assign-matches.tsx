'use client'

export default function AssignMatchesForm({ matches }: { matches: any[] }) {
    const matchess = [
        { id: 1, player1: 'test', player2: 'test2', round: 1, code: 'R1M1' },
        { id: 2, player1: 'player3', player2: 'player4', round: 1, code: 'R1M2' },
        { id: 3, player1: 'player5', player2: 'player6', round: 2, code: 'R2M1' },
    ]

    const stations = [1, 2, 3, 4]
    return (    
        <div>  
            {/* Form to generate stations */}
            <form>
                <div>
                    <input type="number" value="0" />
                    <button>Generate Stations</button>
                </div>
            </form>
            {/* 2 Columns */}
            <div>   
                {/* Left Column - Matches */}
                <div>
                    {matchess.map((match) => (
                        <div key={match.id}>
                            <p>{match.player1} vs {match.player2}</p>
                        </div>
                    ))}
                </div>  
                {/* Right Column - Stations */}
                <div>
                    {stations.map((num) => (
                        <div key={num}>
                            <p>Station {num}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}