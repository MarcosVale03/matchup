import { ChangeEventHandler, HTMLInputTypeAttribute } from "react"

type BasicInputProps = {
    labelClassName: string
    labelText: string,
    inputType: HTMLInputTypeAttribute | undefined
    inputName: string,
    inputId: string,
    inputValue: string | number | readonly string[] | undefined,
    inputOnChange: ChangeEventHandler<HTMLInputElement> | undefined
    required: boolean,
    inputPlaceholder?: string,
    inputClassName: string
}

export default function BasicInputWithLabel({ 
    labelClassName, 
    labelText,
    inputType, 
    inputName, 
    inputId, 
    inputValue,
    inputOnChange,  
    required,
    inputPlaceholder, 
    inputClassName,
}: BasicInputProps) {
    return (
        <div className="relative rounded-xl">
            <label
                htmlFor={inputId}
                className={`${labelClassName} absolute -top-3 left-3 bg-secondary px-1`}
            >
                {labelText}
            </label>
            <input 
                type={inputType}
                name={inputName}
                id={inputId}
                value={inputValue}
                onChange={inputOnChange}
                required={required}
                placeholder={inputPlaceholder}
                className={inputClassName}
            />
        </div>
    )
}