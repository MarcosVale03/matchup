'use client'

import { useState } from 'react'
import { generateBracket } from '@/server/mutations/brackets.mutations'
import { reportMatchResult } from '@/server/mutations/match-results.mutations'
import { fetchBracket } from '@/server/queries/brackets.queries'

/**
 * TEMPORARY TEST PAGE — delete before merging to main.
 */

export default function TestBracketPage() {
    const [tournamentId, setTournamentId] = useState('')
    const [eventName, setEventName] = useState('')
    const [log, setLog] = useState<string[]>([])
    const [bracketData, setBracketData] = useState<any>(null)

    const [matchId, setMatchId] = useState('')
    const [winnerSlot, setWinnerSlot] = useState('1')

    const addLog = (msg: string) => {
        setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`])
    }

    const handleGenerate = async () => {
        addLog(`Generating bracket for tournament=${tournamentId}, event="${eventName}"...`)
        try {
            const result = await generateBracket(parseInt(tournamentId), eventName)
            if (result.success) {
                addLog('Bracket generated successfully')
            } else {
                addLog(`Failed: ${JSON.stringify(result.fieldErrors)}`)
            }
        } catch (err: any) {
            addLog(`Error: ${err.message}`)
        }
    }

    const handleFetch = async () => {
        addLog(`Fetching bracket for tournament=${tournamentId}, event="${eventName}"...`)
        try {
            const result = await fetchBracket(parseInt(tournamentId), eventName)
            if (result.success) {
                setBracketData(result.data)
                addLog(`Fetched ${result.data?.length} matches`)
            } else {
                addLog(`Failed: ${result.message}`)
            }
        } catch (err: any) {
            addLog(`Error: ${err.message}`)
        }
    }

    const handleReport = async () => {
        addLog(`Reporting winner: match=${matchId}, slot=${winnerSlot}...`)
        try {
            const result = await reportMatchResult(
                parseInt(tournamentId), eventName, "1", matchId, parseInt(winnerSlot)
            )
            if (result.success) {
                addLog('Result reported! Fetch bracket again to see advancement.')
            } else {
                addLog(`Failed: ${JSON.stringify(result.fieldErrors)}`)
            }
        } catch (err: any) {
            addLog(`Error: ${err.message}`)
        }
    }

    return (
        <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto text-black">
            <h1 className="text-3xl font-bold mb-1">Bracket Test Page</h1>

            {/* Inputs */}
            <div className="flex gap-4 mb-6">
                <div>
                    <label className="block text-sm font-semibold mb-1">Tournament ID</label>
                    <input
                        type="number"
                        value={tournamentId}
                        onChange={e => setTournamentId(e.target.value)}
                        className="border-2 border-gray-300 rounded px-3 py-2 w-36 bg-white text-black focus:border-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1">Event Name</label>
                    <input
                        type="text"
                        value={eventName}
                        onChange={e => setEventName(e.target.value)}
                        className="border-2 border-gray-300 rounded px-3 py-2 w-52 bg-white text-black focus:border-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
                <button onClick={handleGenerate} className="bg-green-600 text-white px-5 py-2 rounded font-semibold hover:bg-green-700">
                    Generate Bracket
                </button>
                <button onClick={handleFetch} className="bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-blue-700">
                    Fetch Bracket
                </button>
            </div>

            {/* Report Result */}
            <div className="border-t-2 border-gray-200 pt-6 mb-8">
                <h2 className="text-lg font-bold mb-3">Report Match Result</h2>
                <div className="flex gap-3 items-end">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Match ID</label>
                        <input
                            type="text"
                            value={matchId}
                            onChange={e => setMatchId(e.target.value)}
                            className="border-2 border-gray-300 rounded px-3 py-2 w-28 bg-white text-black focus:border-orange-500 focus:outline-none"
                            placeholder="R1M1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Winner Slot</label>
                        <select
                            value={winnerSlot}
                            onChange={e => setWinnerSlot(e.target.value)}
                            className="border-2 border-gray-300 rounded px-3 py-2 bg-white text-black focus:border-orange-500 focus:outline-none"
                        >
                            <option value="1">Slot 1 (Top)</option>
                            <option value="2">Slot 2 (Bottom)</option>
                        </select>
                    </div>
                    <button onClick={handleReport} className="bg-orange-500 text-white px-5 py-2 rounded font-semibold hover:bg-orange-600">
                        Report Winner
                    </button>
                </div>
            </div>

            {/* Log */}
            <div className="mb-8">
                <h2 className="text-lg font-bold mb-2">Log</h2>
                <div className="bg-gray-100 border-2 border-gray-300 text-black p-4 rounded font-mono text-sm max-h-48 overflow-y-auto">
                    {log.length === 0 && <p className="text-gray-400"></p>}
                    {log.map((entry, i) => (
                        <p key={i} className={entry.includes('✅') ? 'text-green-700' : entry.includes('❌') ? 'text-red-600' : 'text-black'}>
                            {entry}
                        </p>
                    ))}
                </div>
            </div>

            {/* Bracket Display */}
            {bracketData && (
                <div>
                    <h2 className="text-lg font-bold mb-2">Bracket Data</h2>
                    <div className="border-2 border-gray-300 rounded overflow-x-auto">
                        <table className="text-sm w-full">
                            <thead className="bg-gray-100">
                                <tr className="text-left border-b-2 border-gray-300">
                                    <th className="py-3 px-4 font-semibold">Match</th>
                                    <th className="py-3 px-4 font-semibold">Slot 1 (Seed)</th>
                                    <th className="py-3 px-4 font-semibold">Slot 2 (Seed)</th>
                                    <th className="py-3 px-4 font-semibold">Advances To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bracketData.map((match: any, i: number) => (
                                    <tr key={match.identifier} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="py-2 px-4 font-mono font-bold">{match.identifier}</td>
                                        <td className="py-2 px-4">
                                            {match.slots[0]?.seed_num
                                                ? <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                                    Seed {match.slots[0].seed_num}
                                                  </span>
                                                : <span className="text-gray-400">— empty —</span>}
                                        </td>
                                        <td className="py-2 px-4">
                                            {match.slots[1]?.seed_num
                                                ? <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                                    Seed {match.slots[1].seed_num}
                                                  </span>
                                                : <span className="text-gray-400">— empty —</span>}
                                        </td>
                                        <td className="py-2 px-4 font-mono">
                                            {match.advance_match_identifier
                                                ? <span className="text-gray-600">→ {match.advance_match_identifier} (slot {match.advance_slot_num})</span>
                                                : <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">🏆 Finals</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}