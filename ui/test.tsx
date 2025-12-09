'use client'

import {addTournament} from "@/utils/actions";

export function AddButton() {
    return (<button onClick={addTournament} className="bg-gray-500 cursor">Add Tournament</button>)
}