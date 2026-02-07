//  generates the structure of a single elimination bracket based on the number of entrants
export interface GeneratedMatch {
    id: string
    round: number
    matchInRound: number
    advance_match_id: string | null
    advance_slot_number: number | null
    slots: GeneratedSlot[]
}

// each slot is a position in the match. can either be occupied by seed num or be empty (null)
export interface GeneratedSlot {
    slot_number: number
    seed_number: number | null
}

// generates the order of seeds for a given bracket size. For example, for 8 seeds, the order would be [1, 8, 4, 5, 2, 7, 3, 6]
function generateSeedOrder(bracketSize: number): number[] {
    if (bracketSize === 1) {
        return [1]
    }

    const half = bracketSize / 2
    const previousRound = generateSeedOrder(half)

    const result: number[] = []
    for (const seed of previousRound) {
        result.push(seed)
        result.push(bracketSize + 1 - seed)
    }
    return result
}

// generates the matches for a single elimination bracket based on the number of entrants. Deals w/ byes as well
export function generateSingleEliminationMatches(numEntrants: number): GeneratedMatch[] {
    // account for if num of entrants is invalid
    if (numEntrants < 2) {
        throw new Error('At least 2 entrants needed for a bracket')
    }

    // calc the number of rounds needed and the total bracket size (next power of 2)
    const numRounds = Math.ceil(Math.log2(numEntrants))
    const bracketSize = Math.pow(2, numRounds)

    const seedOrder = generateSeedOrder(bracketSize)

    const matches: GeneratedMatch[] = []

    // generate matches round by round and assign seeds to first round, leaving the rest empty for now 
    for (let round = 1; round <= numRounds; round++) {
        const matchesInRound = bracketSize / Math.pow(2, round)

        // for each match in the round, determine the match ID, which match it advances to, and the seeds for the first round
        for (let m = 1; m <= matchesInRound; m++) {
            const id = `R${round}M${m}`

            let advance_match_id: string | null = null
            let advance_slot_number: number | null = null

            if (round < numRounds) {
                const nextMatchNumber = Math.ceil(m / 2)
                advance_match_id = `R${round + 1}M${nextMatchNumber}`
                advance_slot_number = (m % 2 === 1) ? 1 : 2
            }

            const slots: GeneratedSlot[] = []

            // first round assign seeds based on order, then others will be filled in as winners/players advance
            if (round === 1) {
                const seedIndex1 = seedOrder[(m - 1) * 2]
                const seedIndex2 = seedOrder[(m - 1) * 2 + 1]
                const seed1 = seedOrder[seedIndex1]
                const seed2 = seedOrder[seedIndex2]

            slots.push({
                    slot_number: 1,
                    seed_number: seed1 <= numEntrants ? seed1 : null
                })
                slots.push({
                    slot_number: 2,
                    seed_number: seed2 <= numEntrants ? seed2 : null
                })
            } else {
                slots.push({ slot_number: 1, seed_number: null })
                slots.push({ slot_number: 2, seed_number: null })
            }

            matches.push({
                id,
                round,
                matchInRound: m,
                advance_match_id,
                advance_slot_number,
                slots
            })
        }
    }

    return matches
}

// in the event that an entrant doesn't have a match, a bye is generated
// check if match is a bye and return seed num of winner. Null otherwise
export function getByeWinner(match: GeneratedMatch): number | null {
    if (match.round !== 1) return null

    const slot1HasSeed = match.slots[0].seed_number !== null
    const slot2HasSeed = match.slots[1].seed_number !== null

    if (slot1HasSeed && !slot2HasSeed) return match.slots[0].seed_number
    if (!slot1HasSeed && slot2HasSeed) return match.slots[1].seed_number

    return null
}