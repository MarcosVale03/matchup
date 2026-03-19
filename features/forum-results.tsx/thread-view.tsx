'use client'
import {Post} from "@/server/queries/forum.queries";
import Link from "next/link";
import {ArrowLeft, MessageCircle} from "lucide-react";
import DeleteThread from "@/features/forum-crud/delete-thread";
import Image from "next/image";
import {formatDateTime} from "@/ui/format-time";
import ForumPostsList from "@/features/forum-results.tsx/forum-post-list";
import AddThreadPost from "@/features/forum-crud/add-post";
import {useToast} from "@/ui/toast/use-toast";
import {Toast} from "@/ui/toast/toast";

export function ThreadView({
                               title,
                               mainThread,
                               posts,
                               isOwner
                           }: {
    title: string;
    mainThread: Post;
    posts: Post[];
    isOwner: boolean;
}) {

    const toast = useToast();

    return (
        <main className="bg-main-bg font-[Poppins] text-black p-4 md:px-8 3xl:px-16">
            <div className="max-w-3xl mx-auto py-6">
                <Link
                    href="/forums"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary
                           transition-colors mb-6"
                >
                    <ArrowLeft className="size-4"/>
                    Back to Forums
                </Link>

                {/* Main thread */}
                {mainThread && (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8 mb-6">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl sm:text-3xl font-jersey-25 text-primary mb-3">
                                {title ?? 'Untitled Thread'}
                            </h1>
                            {isOwner && (
                                <DeleteThread threadId={mainThread.thread_id} />
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-sm mb-5">
                            <Image
                                src="/random-pfp.png"
                                alt="random-pfp"
                                height={30}
                                width={30}
                                className="rounded-full"
                            />
                            <span className="font-semibold ">
                                Author Name
                            </span>
                            <span>•</span>
                            <span className="text-gray-500">{formatDateTime(mainThread.created_at)}</span>
                        </div>

                        <div className="border-t border-gray-100 pt-5">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] sm:text-base font-normal">
                                {mainThread.content}
                            </p>
                        </div>
                    </div>
                )}

                {/* Create post form */}
                <AddThreadPost
                    threadId={mainThread.thread_id}
                    toastControl={toast}
                />

                <div className="mb-2">
                    <Toast message={toast.message} />
                </div>

                {/* Posts under thread */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <MessageCircle className="size-5"/>
                        <h2 className="text-lg font-semibold">
                            {posts.length}
                        </h2>
                    </div>

                    <ForumPostsList posts={posts} toastControl={toast} />
                </div>
            </div>
        </main>
    )


}