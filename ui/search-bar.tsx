import { Search } from "lucide-react";
import React from "react";

type SearchBarProps = {
    searchQuery: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchPlaceholder?: string;
    inputClassName?: string;
};

export default function SearchBar({
    searchQuery,
    handleInputChange,
    searchPlaceholder,
    inputClassName
}: SearchBarProps) {
    return (
        <div className="relative w-full flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-zinc-600 pointer-events-none z-10" />
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
