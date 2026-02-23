'use client';
import { Tournament } from "@/lib/types/types";
import { formatDateTime } from "@/ui/format-time";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/client-layout";
import {
    Calendar,
    Clock,
    ExternalLink,
    Mail,
    MessageCircle,
    User as UserIcon,
    Pencil,
    MessageCircleMore,
    EyeOff, Eye
} from "lucide-react";


// Reusable classes
const cardContainer = "border-2 border-gray-200 shadow-lg rounded-2xl overflow-hidden flex";
const detailRow = "flex items-start gap-3.5 sm:gap-4 p-4 hover:bg-gray-100 transition-colors";
const iconBase = "p-2.5 bg-primary rounded-full text-white shrink-0";
const labelClass = "text-sm font-semibold text-gray-700 mb-0.5";
const valueClass = "text-base sm:text-lg text-gray-900 font-medium";
const buttonClass = `w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent 
                    rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-primary hover:bg-secondary 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 
                    transition-colors`;

export default function TournamentDetails({tournament}: { tournament: Tournament }) {
    const router = useRouter();

    const { user, loading } = useAuth();

    const isOwner = user && user.id === tournament.owner;
    const canEdit = !loading && !!user && isOwner;

    const handleEditClick = () => {
        router.push(`/tournaments/${tournament.id}/edit`);
    };

    const handleForumClick = () => {
        router.push(`/tournaments/${tournament.id}/forum`)
    }

    return (
        <main className="p-4 pt-6 overflow-y-auto">
            <div className="mx-auto max-w-2xl lg:max-w-3xl">
                {/* Header */}
                <div className="mb-3 sm:mb-5 flex place-content-center">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary tracking-tight">
                        {tournament.name}
                    </h1>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                    {canEdit && (
                        <button
                            onClick={handleEditClick}
                            className={buttonClass}
                        >
                            <Pencil size={19} />
                            Edit Tournament
                        </button>
                    )}

                    {/* Tournament Forum */}
                    <button
                        onClick={handleForumClick}
                        className={buttonClass}
                        disabled={true} // Disabled for now
                    >
                        <MessageCircleMore size={19}/>
                        Tournament Forum
                    </button>
                </div>

                {/* Details Card*/}
                <div className={cardContainer}>
                    <div className="p-5 sm:p-6 lg:p-8 space-y-3 sm:space-y-3 w-full">
                        {/* Owner */}
                        <div className={detailRow}>
                            <div className={iconBase}>
                                <UserIcon size={22}/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={labelClass}>
                                    Tournament Owner
                                </h3>
                                <p className={valueClass}>
                                    {tournament.owner}
                                </p>
                            </div>
                        </div>

                        {/* Start Time */}
                        <div className={detailRow}>
                            <div className={iconBase}>
                                <Calendar size={22}/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={labelClass}>
                                    Start Time
                                </h3>
                                <p className={valueClass}>
                                    {formatDateTime(tournament.start_time)}
                                </p>
                            </div>
                        </div>

                        {/* End Time */}
                        <div className={detailRow}>
                            <div className={iconBase}>
                                <Clock size={22}/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={labelClass}>End Time</h3>
                                <p className={valueClass}>
                                    {formatDateTime(tournament.end_time)}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className={detailRow}>
                            <div className={iconBase}>
                                <Mail size={22}/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={labelClass}>Email</h3>
                                <p className={`${valueClass} break-all`}>
                                    {tournament.email_contact || "—"}
                                </p>
                            </div>
                        </div>

                        <div className={detailRow}>
                            <div className={iconBase}>
                                {tournament.is_public ? (
                                    <Eye size={22}/>
                                ) : (
                                    <EyeOff size={22}/>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={labelClass}>
                                    Visibility
                                </h3>
                                {tournament.is_public ? (
                                    <p className={`${valueClass} break-all`}>
                                        Public
                                    </p>
                                ) : (
                                    <p className={`${valueClass} break-all`}>
                                        {tournament.email_contact || "—"}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Discord */}
                        <div className={detailRow}>
                            <div className={iconBase}>
                                <MessageCircle size={22}/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={labelClass}>Discord</h3>
                                <p className={`${valueClass} wrap-break-word`}>
                                    {tournament.discord_invite
                                        ? `https://discord.gg/${tournament.discord_invite}`
                                        : "Not provided"}
                                </p>
                            </div>
                        </div>

                        {/* Visit Site Button */}
                        <div className="pt-3">
                            <button
                                onClick={() => console.log('Visit site clicked')}
                                className={buttonClass}
                            >
                                <ExternalLink size={20}/>
                                Visit Site
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}