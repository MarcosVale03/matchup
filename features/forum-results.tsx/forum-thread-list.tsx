'use client'
import {Thread} from "@/server/queries/forum.queries";
import React, {useState} from "react";
import {CircleAlert, Plus, X} from "lucide-react";
import SearchBar from "@/ui/search-bar";
import AddForumThread from '../forum-crud/add-thread';
import {useProfile} from "@/app/client-layout";
import {useForumToast} from "@/ui/toast/forum-use-toast";
import {ForumToast} from "@/ui/toast/forum-toast";
import Link from "next/link";
import Image from "next/image";
import {formatDate} from "date-fns";

export default function ForumThreadList({threads}: {
    threads: Thread[],
}) {
    const {user} = useProfile();

    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    const toast = useForumToast();

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

    const iconClassName = "size-4 sm:size-5 place-self-center"

    return (
        <div className="w-full rounded-2xl 3xl:px-16">
            {/* Search bar, add button */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
                <SearchBar
                    searchQuery={searchQuery}
                    handleInputChange={(e) => setSearchQuery(e.target.value)}
                    searchPlaceholder="Search forum posts..."
                    inputClassName="block bg-white w-full rounded-xl text-black text-sm md:text-base
                                    p-2.5 pl-9 focus:outline-none focus:border-primary shadow-sm transition
                                    duration-400 border-2 border-white placeholder:font-semibold"
                />

                {/* Add Thread button | only available if logged in */}
                {user ? (
                    <button
                        type="button"
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="flex flex-row items-center justify-center gap-2 w-full md:w-auto py-2.5 text-center
                                 bg-primary text-sm md:text-base font-jersey tracking-wide px-6
                                  rounded-lg hover:bg-secondary text-white hover:cursor-pointer
                                  transition duration-200 whitespace-nowrap"
                    >
                        {isFormOpen ? <X className={iconClassName}/> : <Plus className={iconClassName}/>}
                        {isFormOpen ? 'Cancel' : 'New Thread'}
                    </button>
                ) : (
                    <div
                        className="flex flex-row items-center justify-center gap-2 w-full md:w-auto py-2.5 text-center
                                 bg-primary text-sm md:text-base font-jersey tracking-wide px-6
                                  rounded-lg text-white transition duration-200 whitespace-nowrap"
                    >
                        <CircleAlert className={iconClassName}/>
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
            <div className="flex flex-col gap-2">

                {/* Success Message */}
                <ForumToast message={toast.message}/>

                <div className="">
                    {/* Loading or empty state */}
                    {filteredThreads.length === 0 ? (
                        // Show different messages based on whether there's a search query
                        <div className="p-4 text-center text-zinc-600 text-base md:text-lg">
                            {searchQuery.trim()
                                ? `No results for "${searchQuery.trim()}"`
                                : "No forum threads found."}
                        </div>
                    ) : (
                        // Generate the threads
                        <div className="space-y-4">
                            {filteredThreads.map((thread) => (
                                <div
                                    key={thread.id}
                                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm
                                               hover:shadow-md mb-4 hover:border-primary
                                               transition duration-400"
                                >
                                    {/* Post Title, Author, Tournament, Timestamp */}
                                    <Link
                                        key={thread.id}
                                        href={`/forums/${thread.id}?title=${encodeURIComponent(thread.title)}`}
                                    >
                                        <div className="flex flex-col gap-2 mb-1 text-black">

                                            {/* Author of thread */}
                                            <div className="flex flex-1 min-w-0 gap-2.5 sm:gap-3 text-sm">
                                                <div className="flex flex-row gap-2 place-content-center">
                                                    <Image
                                                        src="/random-pfp.png"
                                                        alt="random-pfp"
                                                        width={24}
                                                        height={24}
                                                        className="rounded-full"
                                                    />
                                                    <p className="font-semibold">Author Name</p>
                                                </div>
                                                <p className="hidden sm:inline">•</p>
                                                <p className="text-gray-600">{formatDate(thread.created_at, "MMM d, yyyy @ h:mm a")}</p>
                                            </div>

                                            {/* Title */}
                                            <h4 className="">
                                                {thread.title}
                                            </h4>
                                        </div>

                                        {/* Thread content */}
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base">
                                            {thread.content}
                                        </p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}