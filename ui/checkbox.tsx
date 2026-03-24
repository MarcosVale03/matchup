import { Check } from "lucide-react"
import React from "react";

type CheckboxProps = {
    /** The `id` attribute for the input, also used by `htmlFor` on the label */
    id: string
    /** The `name` attribute for the input */
    name: string
    /** Whether the checkbox is checked */
    checked: boolean
    /** Change handler passed to the hidden `<input>` */
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    /** Optional label text rendered to the right of the box */
    label?: string

    // Container
    /** className for the outer `<label>` wrapper */
    containerClassName?: string

    // Box styling
    /** className for the visible checkbox box */
    boxClassName?: string
    /** Additional className applied to the box when `checked` is true */
    checkedBoxClassName?: string

    // Check icon
    /** Size (px) of the Lucide `<Check>` icon */
    iconSize?: number
    /** className for the `<Check>` icon */
    iconClassName?: string

    // Label
    /** className for the label `<span>` */
    labelClassName?: string
}

export default function Checkbox({
    id,
    name,
    checked,
    onChange,
    label,
    containerClassName = "flex items-center gap-2 cursor-pointer",
    boxClassName = "h-6 w-6 shrink-0 rounded border-2 border-primary flex items-center justify-center transition-all duration-200",
    checkedBoxClassName = "bg-primary",
    iconSize = 16,
    iconClassName = "text-white",
    labelClassName = "text-lg",
}: CheckboxProps) {
    return (
        <label htmlFor={id} className={containerClassName}>
            <input
                type="checkbox"
                id={id}
                name={name}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            <div className={`${boxClassName} ${checked ? checkedBoxClassName : ""}`}>
                {checked && <Check size={iconSize} className={iconClassName} strokeWidth={3} />}
            </div>
            {label && <span className={labelClassName}>{label}</span>}
        </label>
    )
}