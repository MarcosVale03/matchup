'use client'
import { Thread } from "@/server/queries/forum.queries";
import { FetchTournamentFromIdResponse } from "@/server/queries/tournaments.queries";
import React, { useState } from "react";
import {CircleAlert, Plus, X} from "lucide-react";
import SearchBar from "@/ui/search-bar";
import AddForumThread from '../forum-crud/add-thread';
import { useProfile } from "@/app/client-layout";
import { useToast } from "@/ui/toast/use-toast";
import { Toast } from "@/ui/toast/toast";
import {formatDateTime} from "@/ui/format-time";
import Link from "next/link";
import DeleteThread from "@/features/forum-crud/delete-thread";

export default function ForumThreadList({threads, tournamentData}: {
    threads: Thread[],
    tournamentData?: FetchTournamentFromIdResponse
}) {
    const { user } = useProfile();

    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const toast = useToast();

    // message when a thread is deleted/added
    const handleThreadDeleted = () => toast.show("Thread deleted successfully!");

    const handleThreadAdded = () => {
        toast.show("Thread created successfully!");
        setIsFormOpen(false);
    }

    // show the filtered threads from the search bar
    const filteredThreads = threads
        .filter(thread =>
            thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thread.content.toLowerCase().includes(searchQuery.toLowerCase())
        );

    return (
        <div className="w-full rounded-2xl 3xl:px-16">
            {/* Search bar, add button */}
            <div className="flex flex-col md:flex-row">
                <SearchBar
                    searchQuery={searchQuery}
                    handleInputChange={(e) => setSearchQuery(e.target.value)}
                    searchPlaceholder="Search forum posts..."
                    inputClassName="block bg-white w-full rounded-xl text-black text-sm md:text-base
                                p-2.5 pl-9 focus:outline-none focus:border-primary shadow-sm transition
                                duration-400 border-2 border-white"
                />

                {/* Add Thread button | only available if logged in */}
                {user ? (
                    <button
                        type="button"
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="block w-full xs:w-auto text-center bg-primary text-sm md:text-base
                               font-jersey-25 font-normal tracking-wide p-2 px-6 rounded-lg
                               hover:bg-secondary text-white hover:cursor-pointer transition duration-200"
                    >
                        {isFormOpen ? <X className="size-4" /> : <Plus className="size-4" />}
                        {isFormOpen ? 'Cancel' : 'New Thread'}
                    </button>
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
            </div>

            {/* Add thread form */}
            {isFormOpen && (
                <AddForumThread
                    onAddAction={handleThreadAdded}
                    onCancelAction={() => setIsFormOpen(false)}
                />
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
                                    <div
                                        key={thread.id}
                                        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow mb-4">
                                        {/* Post Title, Author, Tournament, Timestamp */}
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4 text-black">
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/forums/${thread.id}?title=${encodeURIComponent(thread.title)}`}
                                                    className="mb-1.5 font-semibold text-lg sm:text-xl text-gray-900 line-clamp-2
                                                               hover:cursor-pointer hover:text-primary transition duration-200"
                                                >
                                                    {thread.title}
                                                </Link>

                                                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-sm text-gray-500">
                                                    {/* Author */}
                                                    <span className="font-medium text-primary">
                                                        {/* {thread.author_id} */} Author Name
                                                    </span>

                                                    {/* Separator */}
                                                    <span className="hidden sm:inline">
                                                        •
                                                    </span>

                                                    {/* Created at */}
                                                    <span>
                                                        {formatDateTime(thread.created_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Delete thread button */}
                                            <div className="flex items-center gap-2 self-start sm:self-center">
                                                {/* only show buttons if logged in */}
                                                {user && (
                                                    <>
                                                        {/* Delete button for the thread */}
                                                        {/* Only shows if it's the owner */}
                                                        {user.id === thread.author_id && (
                                                            <DeleteThread threadId={thread.id} />
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Thread content */}
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">
                                            {thread.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}