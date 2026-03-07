'use client'
import { Thread } from "@/server/queries/forum.queries";
import { FetchTournamentFromIdResponse } from "@/server/queries/tournaments.queries";
import React, { useState } from "react";
import { CircleAlert } from "lucide-react";
import ForumThreadSingle from "./forum-thread-single";
import SearchBar from "@/ui/search-bar";
import AddForumThread from '../forum-crud/add-thread';
import { useProfile } from "@/app/client-layout";
import {useToast} from "@/ui/use-toast";
import {Toast} from "@/ui/toast";

export default function ForumThreadList({posts, tournamentData}: {
    posts: Thread[],
    tournamentData?: FetchTournamentFromIdResponse
}) {
    const { user } = useProfile();

    const [searchQuery, setSearchQuery] = useState('');

    const toast = useToast();

    // message when a thread is deleted/added
    const handleThreadDeleted = () => toast.show("Thread deleted successfully!");
    const handleThreadAdded = () => toast.show("Thread created successfully!");

    // show the filtered threads from the search bar
    const filteredThreads = posts
        .filter(thread =>
            thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thread.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

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

            {user ? (
                <>
                    {/* Add Thread button | only available if logged in */}
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

            {/* Forum Threads */}
            <div className="flex flex-col gap-4">

                {/* Success Message */}
                <Toast message={toast.message} />


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