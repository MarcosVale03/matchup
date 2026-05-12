'use client'
import {MatchResponse} from "@/server/queries/brackets.queries";
import {FormEventHandler, MouseEventHandler, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {reportScores} from "@/server/mutations/reporting.mutations";

export function MatchReportPopup({ onClickAction, match, showSeeds, tournamentId, eventId, phaseGroupIdentifier }: {
    onClickAction: MouseEventHandler;
    match: MatchResponse;
    showSeeds: boolean;
    tournamentId: number;
    eventId: number;
    phaseGroupIdentifier: string;
}) {
    const {refresh} = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const slot1 = match.match_slots[0];
    const slot2 = match.match_slots[1];
    const [formData, setFormData] = useState({
        slot1Score: slot1.score,
        slot2Score: slot2.score,
        isCompleted: match.is_complete
    })

    useEffect(() => {
        setFormData({
            slot1Score: slot1.score,
            slot2Score: slot2.score,
            isCompleted: match.is_complete
        })
    }, [match.id, slot1.score, slot2.score, match.is_complete])

    const isComplete = match.is_complete;
    const winner = isComplete && slot1.score != slot2.score ? (slot1.score! > slot2.score! ? 1 : 2) : null;

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await reportScores(tournamentId, eventId, phaseGroupIdentifier, match.id, [formData.slot1Score, formData.slot2Score], formData.isCompleted)
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
            refresh()
        }
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClickAction}
        >
            <div
                className="w-full max-w-md bg-gray-50 border-4 border-primary shadow-xl rounded-3xl p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className='w-full h-20 grid grid-cols-2'>
                    <PopupSlot
                        name={slot1.seed?.user?.display_name ?? slot1.prereqCondition ?? "Error"}
                        prefix={slot1.seed?.user?.prefix ?? ""}
                        score={slot1.score}
                        isWinner={winner == 1}
                        seed={slot1.seed?.seed_num ?? null}
                        showSeed={showSeeds}
                        slotNum={1}
                    />
                    <PopupSlot
                        name={slot2.seed?.user?.display_name ?? slot2.prereqCondition ?? "Error"}
                        prefix={slot2.seed?.user?.prefix ?? ""}
                        score={slot2.score}
                        isWinner={winner == 2}
                        seed={slot2.seed?.seed_num ?? null}
                        showSeed={showSeeds}
                        slotNum={2}
                    />
                </div>
                <form className="w-full flex flex-col items-center justify-center mt-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 w-full m-4">
                        <input name='slot1Score' type='number' className='w-10 scale-150 justify-self-center' value={formData.slot1Score ?? 0} min={0}
                               onChange={(e) => {
                                   if (!e.target.validity.valid) return;
                                   setFormData({ ...formData, slot1Score: Number(e.target.value)}) }}
                        />
                        <input name='slot2Score' type='number' className='w-10 scale-150 justify-self-center' value={formData.slot2Score ?? 0} min={0}
                               onChange={(e) => {
                                   if (!e.target.validity.valid) return;
                                   setFormData({ ...formData, slot2Score: Number(e.target.value)}) }}
                        />
                    </div>
                    <div className='m-4'>
                        <input name='isComplete' id="isComplete" type='checkbox' checked={formData.isCompleted}
                               onChange={(e) => {
                                   if (!e.target.validity.valid) return;
                                   setFormData({ ...formData, isCompleted: e.target.checked}) }}
                        />
                        <label htmlFor="isComplete">Match Complete?</label>
                    </div>
                    <button type='submit' className="w-full sm:w-auto flex items-center justify-center py-1 px-16 m-4
                                       rounded-md text-base md:text-lg lg:text-xl font-jersey
                                       text-primary bg-white border-2 border-primary hover:bg-gray-200
                                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            disabled={isSubmitting}
                    >
                        Submit</button>
                </form>
            </div>
        </div>
    );
}


function PopupSlot({
                  name,
                  prefix,
                  score,
                  isWinner,
                  seed,
                  showSeed,
                  slotNum
              }: {
    name: string;
    prefix: string;
    score: number | null;
    isWinner: boolean;
    seed: number | null;
    showSeed: boolean;
    slotNum: number;
}) {
    return (
        <div className={`flex items-center px-3 py-2 justify-between m-4 h-full
            ${isWinner ? "bg-primary/10" : ""}
            ${name === "TBD" ? "text-gray-400 italic" : ""}
            ${slotNum === 2 ? "flex-row-reverse" : ""}`}
        >
            <div className='flex flex-row items-center justify-start'>
                {showSeed && <div className={`text-sm mr-2 pr-3 border-r
                ${isWinner ? "font-bold text-primary" : "text-gray-800"}`}>
                    <p>{seed}</p>
                </div>}
                <p className={`text-sm truncate flex-1
                ${isWinner ? "font-bold text-primary" : "text-gray-800"}`}>
                    {prefix && <span className="mr-1 text-xs">{prefix}</span>}<span>{name}</span>
                </p>
            </div>

            {score != null && (
                <p className={`text-3xl mx-8 font-bold
                    ${isWinner ? "text-primary" : "text-gray-400"}`}>
                    {score}
                </p>
            )}
        </div>
    );
}
