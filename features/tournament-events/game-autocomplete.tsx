'use client';

import BasicInputWithLabel from '@/ui/basic-input-with-label';
import React, { useEffect, useRef, useState } from 'react';
import { fetchVideoGames } from '@/server/queries/video_games.queries';

export function GameAutocomplete({
    value,
    onChange,
    onSelect,
    inputId,
    labelText,
    labelClassName,
    inputClassName,
    required = false,
    placeholder,
}: {
    value: string;
    onChange: (name: string) => void;
    onSelect: (name: string) => void;
    inputId: string;
    labelText: string;
    labelClassName: string;
    inputClassName: string;
    required?: boolean;
    placeholder?: string;
}) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        const handle = setTimeout(async () => {
            try {
                const games = await fetchVideoGames(value.trim(), 0, 8);
                if (cancelled) return;
                const names = games.map((g) => g.name);
                setSuggestions(names);
                const trimmed = value.trim().toLowerCase();
                const exact = names.find((n) => n.toLowerCase() === trimmed);
                if (exact) {
                    onSelectRef.current(exact);
                    setOpen(false);
                }
            } catch {
                if (!cancelled) setSuggestions([]);
            }
        }, 200);
        return () => {
            cancelled = true;
            clearTimeout(handle);
        };
    }, [value, open]);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    return (
        <div ref={wrapperRef} className="relative">
            <BasicInputWithLabel
                labelClassName={labelClassName}
                labelText={labelText}
                inputType="text"
                inputName={inputId}
                inputId={inputId}
                inputValue={value}
                inputOnChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                }}
                required={required}
                inputPlaceholder={placeholder}
                inputClassName={inputClassName}
            />
            {open && suggestions.length > 0 && (
                <ul
                    className="absolute z-20 mt-2 w-full max-h-60 overflow-auto rounded-xl
                               bg-white shadow-lg"
                >
                    {suggestions.map((name) => (
                        <li key={name}>
                            <button
                                type="button"
                                onClick={() => {
                                    onSelect(name);
                                    setOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm md:text-base
                                           font-poppins hover:bg-primary hover:text-white
                                           cursor-pointer transition-colors tracking-tight"
                            >
                                {name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
