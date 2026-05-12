'use client'
import {useRouter, useSearchParams, usePathname} from 'next/navigation';
import React, {useCallback, useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchBar from '@/ui/search-bar';
import {useDebouncedCallback} from 'use-debounce';
import {X} from "lucide-react";

export default function SearchControls() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('query') ?? '');
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        searchParams.get('startDate')
            ? new Date(searchParams.get('startDate') + 'T00:00:00')
            : null
    );

    const updateParams = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete('page'); // reset to first page when filters change
        router.push(`${pathname}?${params.toString()}`);
    }, [router, pathname, searchParams]);

    const debouncedUpdateParams = useDebouncedCallback((value: string) => {
        updateParams('query', value);
    }, 500)

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        debouncedUpdateParams(e.target.value);
    }, [debouncedUpdateParams]);

    const handleDateChange = useCallback((date: Date | null) => {
        setSelectedDate(date); // updates input immediately
        const value = date
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            : '';
        updateParams('startDate', value); // updates URL
    }, [updateParams]);

    // Parse the URL param back into a Date object for the picker
    const currentDate = searchParams.get('startDate')
        ? new Date(searchParams.get('startDate') + 'T00:00:00')
        : null;

    return (
        <form className="flex flex-col gap-2 sm:flex-row mb-6">
            <SearchBar
                searchQuery={searchQuery}
                handleInputChange={handleInputChange}
                searchPlaceholder="Search tournaments by name..."
                inputClassName="block bg-white w-full rounded-xl text-black text-sm md:text-base
                                p-2.5 pl-9 focus:outline-none focus:border-primary shadow-sm transition
                                duration-400 border-2 border-white"
            />
            <div className="relative mt-6 sm:mt-0 sm:w-1/4">
                <label
                    htmlFor="startDateFilter"
                    className="block bg-transparent text-zinc-600 rounded-md
                             peer-focus:text-primary transition duration-400
                             absolute -top-5 px-1 text-sm font-poppins font-semibold"
                >
                    Start Date Filter
                </label>
                <div className="relative">
                    <DatePicker
                        id="startDateFilter"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        placeholderText="mm/dd/yyyy"
                        dateFormat="MM/dd/yyyy"
                        wrapperClassName="w-full"
                        className="peer block bg-white rounded-xl w-full text-black text-sm md:text-base
                               p-2.5 border-2 border-white focus:outline-none focus:border-primary
                               shadow-sm transition duration-400"
                    />
                    {/* Clear the date */}
                    {currentDate && (
                        <button
                            type="button"
                            onClick={() => handleDateChange(null)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400
                                       hover:text-secondary cursor-pointer transition duration-200"
                        >
                            <X className="size-4"/>
                        </button>
                    )}
                </div>

            </div>
        </form>
    );
}