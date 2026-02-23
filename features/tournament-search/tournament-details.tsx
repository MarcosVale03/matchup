'use client';
import { formatTournamentDateTime } from "@/ui/format-time";
import { useRouter } from "next/navigation";
import {TournamentsQueryResponse} from "@/server/queries/tournaments.queries";

// This page will change once we have events going
export default function TournamentDetails({ tournament }: { tournament: TournamentsQueryResponse }) {

    const router = useRouter();

    const handleEditClick = () => {
        const url = `/tournaments/${tournament.id}/edit`;
        router.push(url);
    };

    // listed items classnames
    const mainDiv = "border-b pb-2";
    const paragraphElement = "flex justify-between text-sm text-gray-800 whitespace-pre sm:text-md";
    const spanElement = "font-bold text-black";

    return (
        <main className="bg-white flex flex-col gap-5 m-3">

            {/* Header Section */}
            <div className="">
                <h1 className="text-4xl text-center font-extrabold text-primary">
                    {tournament.name}
                </h1>
            </div>

            {/* Details Grid */}
            <div className="bg-gray-50 p-5 rounded-xl shadow-lg border border-gray-200 max-w-[75vw] place-self-center w-full">
                <h2 className="text-left text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Event Details
                </h2>

                <dl className="space-y-3">
                    {/* Start Time */}
                    <div className={mainDiv}>
                        <p className={paragraphElement}>
                            <span className={spanElement}>Start Time: </span> {formatTournamentDateTime(tournament.start_time)}
                        </p>
                    </div>

                    {/* End Time */}
                    <div className={mainDiv}>
                        <p className={paragraphElement}>
                            <span className={spanElement}>End Time: </span>  {formatTournamentDateTime(tournament.end_time)}
                        </p>
                    </div>

                    {/* Contact Information | Email */}
                    <div className={mainDiv}>
                        <p className={paragraphElement}>
                            <span className={spanElement}>Email: </span>  {tournament.email_contact}
                        </p>
                    </div>

                    {/* Contact Information | Discord */}
                    <div className={mainDiv}>
                        <p className={paragraphElement}>
                            <span className={spanElement}>Discord: </span>
                            {tournament.discord_invite
                                ? `https://discord.gg/${tournament.discord_invite}`
                                : "N/A"}
                        </p>
                    </div>

                    {/* Homepage Link */}
                    {/* To be implemented */}
                    <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-600">
                            Official Homepage
                        </p>
                        <div>
                            {/* <Link 
                                    href={tournament.home_page} 
                                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                                >
                                    Visit Site
                                </Link> */}

                            <p className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer">
                                Visit Site
                            </p>
                        </div>
                    </div>
                </dl>
            </div>
        </main>

    );
}