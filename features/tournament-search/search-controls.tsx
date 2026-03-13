'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import SearchBar from '@/ui/search-bar';
import { useDebouncedCallback } from 'use-debounce';
import BasicInputWithLabel from '@/ui/basic-input-with-label';

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
        <form className="flex flex-col gap-2 sm:flex-row mb-6">
            <SearchBar
                searchQuery={searchQuery}
                handleInputChange={handleInputChange}
                searchPlaceholder="Search tournaments by name..."
                inputClassName="mt-1 block font-jersey-25 bg-white w-full rounded-xl border-2 
                border-tertiary text-black text-md lg:text-xl p-3 shadow-md focus:outline-primary 
                [&::-webkit-search-cancel-button]:hidden pl-10"
            />

            {/* Date Filter */}
            <div className="relative w-1/4">
                <label 
                    htmlFor="startDateFilterInput"
                    className="absolute -top-3 left-3 bg-secondary px-1 block text-sm lg:text-lg bg-white 
                    text-tertiary rounded-md"
                >
                    Start Date Filter
                </label>
                <input
                    id="startDateFilterInput"
                    type="date"
                    max="9999-12-31"
                    defaultValue={searchParams.get('startDate') ?? ''}
                    onChange={handleDateChange}
                    className="mt-1 block font-jersey-25 bg-white w-full rounded-xl border-2 border-tertiary 
                    text-black text-md lg:text-xl p-3 shadow-md focus:outline-primary"
                />
            </div>
        </form>
    );
}