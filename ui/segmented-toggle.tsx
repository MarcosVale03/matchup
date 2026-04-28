import React from "react";

export type SegmentOption<T extends string | number | boolean> = {
    value: T;
    label: string;
};

// Replaces radio groups when every option has equal visual weight.
// Works for booleans, strings, and numbers — generic `T` is inferred from the
// options array
export function SegmentedToggle<T extends string | number | boolean>({
    options,
    value,
    onChange,
    ariaLabel,
    className,
}: {
    options: readonly SegmentOption<T>[];
    value: T;
    onChange: (v: T) => void;
    ariaLabel?: string;
    className?: string;
}) {
    return (
        <div
            role="radiogroup"
            aria-label={ariaLabel}
            className={`inline-flex rounded-lg border-2 border-primary overflow-hidden ${className ?? ""}`}
        >
            {options.map((opt) => {
                const selected = opt.value === value;
                return (
                    <button
                        key={String(opt.value)}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(opt.value)}
                        className={`px-4 py-1.5 text-sm md:text-base font-semibold tracking-tight transition-colors ${
                            selected
                                ? "bg-primary text-white"
                                : "text-primary hover:bg-secondary hover:text-white hover:cursor-pointer"
                        }`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
