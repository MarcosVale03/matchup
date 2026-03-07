'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import React, {useCallback, useState} from 'react';
import SearchBar from '@/ui/search-bar';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchControls() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('query') ?? '');

    const updateParams = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // updates the URL
        router.push(`${pathname}?${params.toString()}`);
    }, [router, pathname, searchParams]);

    // debounce the query so it doesn't run on every keystroke
    const debouncedUpdateParams = useDebouncedCallback((value: string) => {
        updateParams('query', value);
    }, 500)

    // for the search bar to update immediately
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);          // updates input immediately
        debouncedUpdateParams(e.target.value);   // updates URL after 500ms
    }, [debouncedUpdateParams]);

    const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        updateParams('startDate', e.target.value);
    }, [updateParams]);

    return (
        <form className="flex flex-col gap-3 sm:flex-row sm:gap-0 bg-white mb-6 sm:mb-8">
            <SearchBar
                searchQuery={searchQuery}
                handleInputChange={handleInputChange}
                searchPlaceholder="Search tournaments by name..."
                inputClassName="w-full p-3 pl-10 sm:p-4 sm:pl-10 text-sm sm:text-base text-gray-800 border-2
                                border-gray-300 rounded-lg focus:outline-none focus:border-primary
                                transition duration-150 sm:rounded-r-none"
            />

            {/* Date Filter */}
            <input
                id="startDateFilterInput"
                type="date"
                max="9999-12-31"
                defaultValue={searchParams.get('startDate') ?? ''}
                onChange={handleDateChange}
                className="w-full sm:w-auto p-3 sm:p-4 text-sm sm:text-base text-gray-800 border-2 border-gray-300
                           rounded-lg focus:outline-none focus:border-primary transition duration-150 cursor-pointer
                           sm:rounded-l-none sm:min-w-[180px]"
            />
        </form>
    );
}