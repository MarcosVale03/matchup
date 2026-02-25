'use client'
import { Thread } from "@/server/queries/forum.queries";
import { FetchTournamentFromIdResponse } from "@/server/queries/tournaments.queries";
import React, { useState } from "react";
import { CheckCircle, CircleAlert } from "lucide-react";
import ForumThreadSingle from "./forum-thread-single";
import SearchBar from "@/ui/search-bar";
import AddForumThread from '../forum-crud/add-thread';
import { useAuth } from "@/app/client-layout";

export default function ForumThreadList({posts, tournamentData}: { posts: Thread[], tournamentData?: FetchTournamentFromIdResponse }) {
    const {user, loading} = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleThreadDeleted = () => {
        setSuccessMessage("Thread deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleThreadAdded = () => {
        setSuccessMessage("Thread created successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
    }

    const filteredThreads = posts
        .filter(thread =>
            thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thread.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const skeletonButton = (
        <div className="w-full p-3 bg-primary text-center animate-pulse rounded-md">
            Loading...
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Search bar*/}
            <SearchBar
                searchQuery={searchQuery}
                handleInputChange={(e) => setSearchQuery(e.target.value)}
                searchPlaceholder={
                    tournamentData?.id
                        ? "Search posts in this tournament..."
                        : "Search forum posts..."
                }
                inputClassName="w-full max-w-full p-3 pl-10 text-base border-2 border-gray-300 
                                rounded-xl outline-primary transition duration-150 shadow-sm
                                placeholder:text-gray-400 text-gray-800"
            />

            {loading ? (
                <div className="w-full">
                    {/* placeholder buttons */}
                    {skeletonButton}
                </div>
            ) : (
                <>
                    {user ? (
                        <>
                            {/* Add post button | only show if logged in*/}
                            <AddForumThread onAddAction={handleThreadAdded}/>
                        </>
                    ) : (
                        <div
                            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 border
                                       border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium
                                       text-white bg-primary transition-colors"
                        >
                            <CircleAlert className="w-5 h-5"/>
                            Log in or make an account to create a thread
                        </div>
                    )}
                </>
            )}

            {/* Forum Threads */}
            <div className="flex flex-col gap-4">

                {/* Success Message */}
                {successMessage && (
                    <div
                        className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                        <CheckCircle className="w-5 h-5"/>
                        {successMessage}
                    </div>
                )}

                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    {tournamentData?.id ? "Tournament Discussion" : "Forum Threads"}
                </h2>

                <div className="overflow-y-auto">
                    <div className="sm:h-[calc(100vh-350px)] overflow-y-auto lg:pr-2">
                        {/* Loading or empty state */}
                        {filteredThreads.length === 0 ? (
                            // Show different messages based on whether there's a search query or if we're filtering by tournament
                            <div className="p-8 sm:p-12 text-center text-gray-500">
                                {searchQuery.trim()
                                    ? `No results for "${searchQuery.trim()}"`
                                    : tournamentData?.id
                                        ? "No threads yet – start the conversation!"
                                        : "No forum threads found."}
                            </div>
                        ) : (
                            // Generate the threads
                            <div className="space-y-4 lg:pr-2">
                                {filteredThreads.map((thread) => (
                                    <ForumThreadSingle
                                        key={thread.id}
                                        thread={thread}
                                        onThreadDeleteAction={handleThreadDeleted}
                                        user={user}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}