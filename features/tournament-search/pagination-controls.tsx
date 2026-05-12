'use client'
import {useRouter, useSearchParams, usePathname} from 'next/navigation';
import {ChevronLeft, ChevronRight} from 'lucide-react';

export default function PaginationControls({page, totalPages}: { page: number; totalPages: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const navigate = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-4 mb-2">
            <button
                onClick={() => navigate(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-poppins font-semibold
                           bg-white shadow-sm border-2 border-white hover:border-primary
                           disabled:opacity-40 disabled:cursor-not-allowed transition duration-200"
            >
                <ChevronLeft className="size-4"/>
                Prev
            </button>
            <span className="text-sm text-zinc-500 font-poppins font-semibold">
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => navigate(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-poppins font-semibold
                           bg-white shadow-sm border-2 border-white hover:border-primary
                           disabled:opacity-40 disabled:cursor-not-allowed transition duration-200"
            >
                Next
                <ChevronRight className="size-4"/>
            </button>
        </div>
    );
}
