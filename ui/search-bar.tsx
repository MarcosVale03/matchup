import { Search } from "lucide-react";
import React from "react";

type SearchBarProps = {
    searchQuery: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchPlaceholder?: string;
    inputClassName?: string;
};

export default function SearchBar({ searchQuery, handleInputChange, searchPlaceholder, inputClassName }: SearchBarProps) {
    return (
        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="search"
                id="search-bar"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={searchPlaceholder ?? "Search by name..."}
                className={inputClassName}
            />
        </div>
    )

}
